class LocaleSiteSetting

  def self.valid_value?(val)
    supported_locales.include?(val)
  end

  def self.all_values
    supported_locales
  end


  private

  @lock = Mutex.new

  def self.supported_locales
    @lock.synchronize do
      @supported_locales ||= Dir.glob( File.join(Rails.root, 'config', 'locales', 'client.*.yml') ).map {|x| x.split('.')[-2]}.sort
    end
  end
end
