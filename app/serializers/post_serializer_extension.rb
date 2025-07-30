# frozen_string_literal: true

PostSerializer.class_eval do
  attributes :is_dice, :dice_value

  def is_dice
    value = object.custom_fields['is_dice']
    [true, "true", "t", "1"].include?(value)
  end

  def include_is_dice?
    object.custom_fields.key?('is_dice')
  end

  def dice_value
    object.custom_fields['dice_value']
  end

  def include_dice_value?
    object.custom_fields.key?('dice_value')
  end
end
