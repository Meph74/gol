# set secure: true, optionally only do this for certain Rails environments (e.g., Staging / Production
unless Rails.configuration.localhost
  Rails.application.config.session_store :cookie_store, key: '_gol_session', httponly: true, secure: true
end
