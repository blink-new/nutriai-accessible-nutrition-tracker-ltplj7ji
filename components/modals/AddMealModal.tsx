import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../ui/Button';
import Card from '../ui/Card';
import * as Haptics from 'expo-haptics';

interface AddMealModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMeal: (meal: {
    name: string;
    calories: number;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
  }) => void;
}

export default function AddMealModal({ visible, onClose, onAddMeal }: AddMealModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [selectedType, setSelectedType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: 'sunny' },
    { key: 'lunch', label: 'Lunch', icon: 'partly-sunny' },
    { key: 'dinner', label: 'Dinner', icon: 'moon' },
    { key: 'snack', label: 'Snack', icon: 'cafe' },
  ] as const;

  const handleAddMeal = () => {
    if (!mealName.trim() || !calories.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const caloriesNum = parseInt(calories);
    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      Alert.alert('Error', 'Please enter a valid number of calories');
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    onAddMeal({
      name: mealName.trim(),
      calories: caloriesNum,
      type: selectedType,
      time,
    });

    // Reset form
    setMealName('');
    setCalories('');
    setSelectedType('breakfast');
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FFFFFF' }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#333333' : '#E5E5E5',
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
          </TouchableOpacity>
          
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: isDark ? '#FFFFFF' : '#212121',
            }}
          >
            Add Meal
          </Text>
          
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          {/* Meal Name */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: '500',
                color: isDark ? '#FFFFFF' : '#212121',
                marginBottom: 8,
              }}
            >
              Meal Name
            </Text>
            <TextInput
              style={{
                backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                fontFamily: 'Inter',
                color: isDark ? '#FFFFFF' : '#212121',
              }}
              placeholder="Enter meal name..."
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={mealName}
              onChangeText={setMealName}
            />
          </View>

          {/* Calories */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: '500',
                color: isDark ? '#FFFFFF' : '#212121',
                marginBottom: 8,
              }}
            >
              Calories
            </Text>
            <TextInput
              style={{
                backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                fontFamily: 'Inter',
                color: isDark ? '#FFFFFF' : '#212121',
              }}
              placeholder="Enter calories..."
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
          </View>

          {/* Meal Type */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: '500',
                color: isDark ? '#FFFFFF' : '#212121',
                marginBottom: 12,
              }}
            >
              Meal Type
            </Text>
            
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              {mealTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={{
                    width: '48%',
                    backgroundColor: selectedType === type.key
                      ? '#4CAF50'
                      : isDark
                      ? '#1E1E1E'
                      : '#F5F5F5',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    alignItems: 'center',
                    borderWidth: selectedType === type.key ? 2 : 0,
                    borderColor: '#4CAF50',
                  }}
                  onPress={() => {
                    setSelectedType(type.key);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Ionicons
                    name={type.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={selectedType === type.key
                      ? '#FFFFFF'
                      : '#4CAF50'
                    }
                    style={{ marginBottom: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Inter',
                      fontWeight: '500',
                      color: selectedType === type.key
                        ? '#FFFFFF'
                        : isDark
                        ? '#FFFFFF'
                        : '#212121',
                    }}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Add Button */}
          <Button
            title="Add Meal"
            onPress={handleAddMeal}
            variant="primary"
            disabled={!mealName.trim() || !calories.trim()}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}