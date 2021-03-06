class ApplicationController < ActionController::Base

  def throw_not_found
    raise ActionController::RoutingError.new('Not Found')
  rescue
    render_404
  end

  def render_404
    render file: "#{Rails.root}/public/404", :layout => false, status: :not_found
  end

  def index
    render 'layouts/index'
  end
end

