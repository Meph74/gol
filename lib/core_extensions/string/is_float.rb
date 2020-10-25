# Returns true if string contains a vaild float value, otherwise false
String.class_eval do
  def is_float?
    # The double bang ensures that we return true instead of a 'truthy' value
    !!Float(self) rescue false
  end
end
