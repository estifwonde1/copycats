FROM ruby:3.1.0

# Timezone configuration
RUN echo "Africa/Addis_Ababa" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

RUN apt-get update -qq && apt-get install -y nodejs postgresql-client cmake
RUN mkdir /opt/app
WORKDIR /opt/app

COPY ./cats_warehouse/Gemfile ./cats_warehouse/Gemfile.lock ./

RUN bundle config set --local without 'development test'
RUN bundle install --jobs 20 --retry 5

COPY ./cats_warehouse/ .

EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
