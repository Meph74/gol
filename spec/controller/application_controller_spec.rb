require "rails_helper"

RSpec.describe ApplicationController, :type => :controller do
  context 'Gol' do
    describe "GET index" do
      it "returns a 200 OK status" do
        get :index
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
