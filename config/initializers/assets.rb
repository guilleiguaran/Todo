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

Rails.application.config.middleware.insert_after Rack::Sendfile, ActionDispatch::Static, File.join(Rails.root, "tmp", "webpack")

process = ChildProcess.build("webpack")

process.io.inherit!
process.start
