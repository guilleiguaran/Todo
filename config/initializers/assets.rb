module WebpackAssetUrlHelper
  def compute_asset_path(path, options = {})
    if asset_path = manifest[path]
      "/assets/" + asset_path
    else
      "/assets/" + path
    end
  end

  private

  def manifest
    @manifest ||= read_manifest
  end

  def read_manifest
    file = File.join(Rails.root, 'public', 'assets', 'manifest.json')
    if File.exist?(file)
      JSON.parse(File.read(file))
    else
      {}
    end
  end
end

ActiveSupport.on_load(:action_view) do
  include WebpackAssetUrlHelper
end

webpack_tmp_path = File.join(Rails.root, "tmp", "webpack")

Rails.application.config.middleware.insert_after Rack::Sendfile, ActionDispatch::Static, webpack_tmp_path

ChildProcess.posix_spawn = true
process = ChildProcess.build("webpack")

semaphore = Concurrent::Semaphore.new(1)

process.io.inherit!
process.start

webpack_reloader = Listen.to(webpack_tmp_path, only: /restart\.txt/) do
  semaphore.acquire
  puts "Restarting Webpack..."
  begin
    process.poll_for_exit(5)
  rescue ChildProcess::TimeoutError
    process.stop
  end
  process.start
  semaphore.release
end

webpack_reloader.start
