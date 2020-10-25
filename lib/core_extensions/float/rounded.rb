# returns the float value without any fractional digits if the float is a whole number,
# otherwise it will return fractional digits up to the ndigits value specified, default is 2
Float.class_eval do
  def rounded(ndigits = 2)
    self.is_whole? ? self.round(0) : self.round(ndigits)
  end
end
