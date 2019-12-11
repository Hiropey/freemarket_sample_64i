require 'carrierwave/storage/abstract'
require 'carrierwave/storage/file'
require 'carrierwave/storage/fog'

CarrierWave.configure do |config|
  if Rails.env.production?
    config.storage = :fog
    config.fog_provider = 'fog/aws'
    config.fog_directory  = 'freemarket-sample-64i-image'
    config.fog_credentials = {
      provider: 'AWS',
      aws_access_key_id: Rails.application.secrets.aws_access_key_id,
      aws_secret_access_key: Rails.application.secrets.aws_secret_access_key,
      region: 'ap-northeast-1'
    }
  elsif Rails.env.development?
    config.storage :file
  else
    config.enable_processing = false 
  end
  config.fog_directory  = 'freemarket-sample-64i-image'
  config.asset_host = 'https://s3-ap-northeast-1.amazonaws.com/freemarket-sample-64i-image'
end
