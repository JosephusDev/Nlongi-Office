import { TextInput, TextInputProps } from 'react-native'
import { s } from './styles'
import { colors } from '@/styles/theme'
import { useState } from 'react'

interface InputProps extends Omit<TextInputProps, 'onChangeText'> {
  placeholder?: string
  onValueChange?: (value: string) => void
  value?: string
}

export default function Input({
  placeholder,
  onValueChange,
  value,
  style,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <TextInput
      value={value}
      onChangeText={onValueChange}
      {...rest}
      style={[s.input, style, isFocused && s.inputFocused]}
      placeholder={placeholder}
      placeholderTextColor={colors.gray[200]}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  )
}
