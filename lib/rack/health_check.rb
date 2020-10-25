# Ruby Rack App that returns Rails App's Health
module Rack
  class HealthCheck
    def call(env)
      status = {
        postgres: {
          connected: postgres_connected,
          migrations_updated: postgres_migrations_updated
        }
      }

      return [200, {}, [status.to_json]]
    end

    protected

    def postgres_connected
      begin
        ApplicationRecord.establish_connection
        ApplicationRecord.connection
        ApplicationRecord.connected?
      rescue
        false
      end
    end

    def postgres_migrations_updated
      return false unless postgres_connected

      !ApplicationRecord.connection.migration_context.needs_migration?
    end
  end
end
