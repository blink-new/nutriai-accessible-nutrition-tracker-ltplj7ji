import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../ui/Button';
import * as Haptics from 'expo-haptics';

interface WaterLogModalProps {
  visible: boolean;
  onClose: () => void;
  onLogWater: (amount: number) => void;
  currentWater: number;
  dailyGoal: number;
}

export default function WaterLogModal({ 
  visible, 
  onClose, 
  onLogWater, 
  currentWater, 
  dailyGoal 
}: WaterLogModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [selectedAmount, setSelectedAmount] = useState(250);

  const waterAmounts = [
    { amount: 125, label: '125ml', icon: 'wine' },
    { amount: 250, label: '250ml', icon: 'cafe' },
    { amount: 500, label: '500ml', icon: 'water' },
    { amount: 750, label: '750ml', icon: 'water' },
  ];

  const handleLogWater = () => {
    onLogWater(selectedAmount);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  const progressPercentage = Math.min((currentWater / dailyGoal) * 100, 100);

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
            Log Water
          </Text>
          
          <View style={{ width: 24 }} />
        </View>

        <View style={{ flex: 1, padding: 20 }}>
          {/* Current Progress */}
          <View
            style={{
              backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
              borderRadius: 16,
              padding: 20,
              marginBottom: 32,
              alignItems: 'center',
            }}
          >
            <Ionicons name="water" size={48} color="#2196F3" style={{ marginBottom: 12 }} />
            
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'Inter',
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : '#212121',
                marginBottom: 4,
              }}
            >
              {currentWater}ml
            </Text>
            
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter',
                color: isDark ? '#CCCCCC' : '#666666',
                marginBottom: 16,
              }}
            >
              of {dailyGoal}ml daily goal
            </Text>

            {/* Progress Bar */}
            <View
              style={{
                width: '100%',
                height: 8,
                backgroundColor: isDark ? '#333333' : '#E5E5E5',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${progressPercentage}%`,
                  height: '100%',
                  backgroundColor: '#2196F3',
                }}
              />
            </View>
            
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Inter',
                color: '#2196F3',
                marginTop: 8,
              }}
            >
              {Math.round(progressPercentage)}% complete
            </Text>
          </View>

          {/* Amount Selection */}
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: isDark ? '#FFFFFF' : '#212121',
              marginBottom: 16,
            }}
          >
            Select Amount
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginBottom: 32,
            }}
          >
            {waterAmounts.map((water) => (
              <TouchableOpacity
                key={water.amount}
                style={{
                  width: '48%',
                  backgroundColor: selectedAmount === water.amount
                    ? '#2196F3'
                    : isDark
                    ? '#1E1E1E'
                    : '#F5F5F5',
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 12,
                  alignItems: 'center',
                  borderWidth: selectedAmount === water.amount ? 2 : 0,
                  borderColor: '#2196F3',
                }}
                onPress={() => {
                  setSelectedAmount(water.amount);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons
                  name={water.icon as keyof typeof Ionicons.glyphMap}
                  size={32}
                  color={selectedAmount === water.amount
                    ? '#FFFFFF'
                    : '#2196F3'
                  }
                  style={{ marginBottom: 8 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: selectedAmount === water.amount
                      ? '#FFFFFF'
                      : isDark
                      ? '#FFFFFF'
                      : '#212121',
                  }}
                >
                  {water.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Log Button */}
          <Button
            title={`Log ${selectedAmount}ml Water`}
            onPress={handleLogWater}
            variant="primary"
            style={{ backgroundColor: '#2196F3' }}
          />
        </View>
      </View>
    </Modal>
  );
}