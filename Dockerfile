FROM ruby:2.7.0


# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
RUN apt remove cmdtest
RUN apt remove yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get -y update
RUN apt-get install -y yarn

# Set an environment variable where the Rails app is installed to inside of Docker image:
ENV RAILS_ROOT /var/www/bw
RUN mkdir -p $RAILS_ROOT

# Default env to dev unless specified in docker build command
ARG ENVIRONMENT=development
ARG RAILS_ENV=${ENVIRONMENT}
ARG RACK_ENV=${ENVIRONMENT}
ARG NODE_ENV=${ENVIRONMENT}

# env variable to suppress ruby 2.7 log spam, needs to be set here because it is a pre build option
ENV RUBYOPT="-W:no-deprecated -W:no-experimental"

# Set working directory, where the commands will be ran:
WORKDIR $RAILS_ROOT

# Adding gems
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock

# Adding Google Sentiment key

# Set different without options for bundle per env
RUN if [ "$ENVIRONMENT" = "production" ] ; then bundle config set without 'development test' ; fi
RUN if [ "$ENVIRONMENT" = "development" ] ; then bundle config set without 'test' ; fi
RUN if [ "$ENVIRONMENT" = "test" ] ; then bundle config set without 'development' ; fi
RUN bundle install --jobs 20 --retry 5

# Adding project files
COPY . .
RUN yarn install

# Install vim for dev env
RUN if [ "$ENVIRONMENT" = "development" ] ; then apt-get install -y vim ; fi

# Install psql client for dev env
RUN if [ "$ENVIRONMENT" = "development" ] ; then apt-get install -y postgresql-client ; fi

# Install netcat for dev env
RUN if [ "$ENVIRONMENT" = "development" ] ; then apt-get install -y netcat ; fi

#EXPOSE 3000
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]

