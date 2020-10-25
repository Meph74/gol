Rails.application.routes.draw do
  resources :autocompletes
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get 'status', to: proc { [200, {}, ['Healthy']] }

  root 'application#index'

end
