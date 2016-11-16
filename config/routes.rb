Rails.application.routes.draw do
  namespace :api do
    resources :todos, controller: :tasks, except: [:new, :edit], defaults: { format: 'json' } do
      collection do
      	delete '/', action: :completed
      end
    end
  end

  get '/api', to: proc { |env| [200, {"Content-Type" => 'application/json'}, ["{}"]] }

  get 'pages/index'
  root to: 'pages#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
