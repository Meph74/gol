# returns true if the float value is a whole number, otherwise false
Float.class_eval do
  def is_whole?
    self % 1 == 0
  end
end
