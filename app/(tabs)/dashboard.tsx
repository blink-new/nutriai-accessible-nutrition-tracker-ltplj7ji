import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ActionSheetIOS,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/ui/Card';
import CircularProgress from '../../components/ui/CircularProgress';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import Button from '../../components/ui/Button';
import AddMealModal from '../../components/modals/AddMealModal';
import WaterLogModal from '../../components/modals/WaterLogModal';
import { useAppNavigation } from '../../hooks/useNavigation';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface MealData {
  id: string;
  name: string;
  calories: number;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useAppNavigation();
  
  const [caloriesConsumed, setCaloriesConsumed] = useState(1247);
  const [caloriesGoal] = useState(2000);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [waterConsumed, setWaterConsumed] = useState(1200);
  const [waterGoal] = useState(2000);
  
  const [todaysMeals] = useState<MealData[]>([
    { id: '1', name: 'Avocado Toast', calories: 320, time: '8:30 AM', type: 'breakfast' },
    { id: '2', name: 'Greek Salad', calories: 450, time: '12:45 PM', type: 'lunch' },
    { id: '3', name: 'Protein Smoothie', calories: 280, time: '3:20 PM', type: 'snack' },
    { id: '4', name: 'Grilled Salmon', calories: 520, time: '7:15 PM', type: 'dinner' },
  ]);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Scan Food',
      icon: 'scan',
      color: '#4CAF50',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigateToScanner('barcode');
      },
    },
    {
      id: '2',
      title: 'Add Meal',
      icon: 'restaurant',
      color: '#FF8C00',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowAddMealModal(true);
      },
    },
    {
      id: '3',
      title: 'Water Log',
      icon: 'water',
      color: '#2196F3',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowWaterModal(true);
      },
    },
    {
      id: '4',
      title: 'AI Chat',
      icon: 'chatbubble-ellipses',
      color: '#9C27B0',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigateToAI('chat');
      },
    },
  ];

  const progressPercentage = (caloriesConsumed / caloriesGoal) * 100;

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return 'sunny';
      case 'lunch': return 'partly-sunny';
      case 'dinner': return 'moon';
      case 'snack': return 'cafe';
      default: return 'restaurant';
    }
  };

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return {
      day: date.getDate().toString(),
      weekday: date.toLocaleDateString('en', { weekday: 'short' }),
    };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleFABPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Add Meal', 'Scan Food', 'Log Water', 'Ask AI'],
          cancelButtonIndex: 0,
          title: 'Quick Actions',
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 1:
              setShowAddMealModal(true);
              break;
            case 2:
              navigation.navigateToScanner();
              break;
            case 3:
              setShowWaterModal(true);
              break;
            case 4:
              navigation.navigateToAI('chat');
              break;
          }
        }
      );
    } else {
      Alert.alert(
        'Quick Actions',
        'Choose an action',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Meal', onPress: () => setShowAddMealModal(true) },
          { text: 'Scan Food', onPress: () => navigation.navigateToScanner() },
          { text: 'Log Water', onPress: () => setShowWaterModal(true) },
          { text: 'Ask AI', onPress: () => navigation.navigateToAI('chat') },
        ]
      );
    }
  };

  const handleAddMeal = (meal: {
    name: string;
    calories: number;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
  }) => {
    // Add meal to today's meals
    setCaloriesConsumed(prev => prev + meal.calories);
    Alert.alert('Success!', `${meal.name} has been added to your journal.`);
  };

  const handleLogWater = (amount: number) => {
    setWaterConsumed(prev => prev + amount);
    Alert.alert('Success!', `${amount}ml of water has been logged.`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FFFFFF' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: isDark ? '#FFFFFF' : '#212121',
              marginBottom: 4,
            }}
          >
            Good morning! 👋
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter',
              color: isDark ? '#CCCCCC' : '#666666',
            }}
          >
            Let's track your nutrition today
          </Text>
        </View>

        {/* Calendar */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {generateCalendarDays().map((date, index) => {
              const { day, weekday } = formatDate(date);
              const isSelected = isToday(date);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    alignItems: 'center',
                    marginHorizontal: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 16,
                    backgroundColor: isSelected
                      ? '#4CAF50'
                      : isDark
                      ? '#1E1E1E'
                      : '#F5F5F5',
                    minWidth: 60,
                  }}
                  onPress={() => {
                    setSelectedDate(date);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'Inter',
                      color: isSelected
                        ? '#FFFFFF'
                        : isDark
                        ? '#CCCCCC'
                        : '#666666',
                      marginBottom: 4,
                    }}
                  >
                    {weekday}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      color: isSelected
                        ? '#FFFFFF'
                        : isDark
                        ? '#FFFFFF'
                        : '#212121',
                    }}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Calories Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Card>
            <View style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  color: isDark ? '#FFFFFF' : '#212121',
                  marginBottom: 16,
                }}
              >
                Daily Calories
              </Text>
              
              <CircularProgress
                size={120}
                strokeWidth={8}
                progress={progressPercentage}
                color="#4CAF50"
                text={`${caloriesConsumed}`}
                showText={true}
              />
              
              <View style={{ marginTop: 16, alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Inter',
                    color: isDark ? '#CCCCCC' : '#666666',
                  }}
                >
                  of {caloriesGoal} calories
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Inter',
                    color: '#4CAF50',
                    marginTop: 4,
                  }}
                >
                  {caloriesGoal - caloriesConsumed} remaining
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: isDark ? '#FFFFFF' : '#212121',
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={{
                  width: (width - 60) / 2,
                  backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  alignItems: 'center',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.3 : 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: `${action.color}20`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: isDark ? '#FFFFFF' : '#212121',
                    textAlign: 'center',
                  }}
                >
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Meals */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: isDark ? '#FFFFFF' : '#212121',
              marginBottom: 16,
            }}
          >
            Today's Meals
          </Text>
          
          <Card>
            {todaysMeals.map((meal, index) => (
              <View key={meal.id}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#4CAF5020',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Ionicons
                      name={getMealIcon(meal.type)}
                      size={20}
                      color="#4CAF50"
                    />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Inter',
                        fontWeight: '500',
                        color: isDark ? '#FFFFFF' : '#212121',
                        marginBottom: 2,
                      }}
                    >
                      {meal.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Inter',
                        color: isDark ? '#CCCCCC' : '#666666',
                      }}
                    >
                      {meal.time}
                    </Text>
                  </View>
                  
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Inter',
                      fontWeight: '600',
                      color: '#4CAF50',
                    }}
                  >
                    {meal.calories} cal
                  </Text>
                </View>
                
                {index < todaysMeals.length - 1 && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: isDark ? '#333333' : '#E5E5E5',
                      marginVertical: 4,
                    }}
                  />
                )}
              </View>
            ))}
          </Card>
        </View>

        {/* AI Suggestions */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: isDark ? '#FFFFFF' : '#212121',
              marginBottom: 16,
            }}
          >
            AI Suggestions
          </Text>
          
          <Card
            gradient={true}
            gradientColors={['#4CAF50', '#45A049']}
            style={{ padding: 20 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="bulb" size={24} color="#FFFFFF" />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginLeft: 8,
                }}
              >
                Nutrition Tip
              </Text>
            </View>
            
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter',
                color: '#FFFFFF',
                lineHeight: 20,
                marginBottom: 16,
              }}
            >
              You're doing great! Consider adding more protein to reach your daily goal. Try a handful of almonds or Greek yogurt.
            </Text>
            
            <Button
              title="Get More Tips"
              onPress={() => navigation.navigateToAI('insights')}
              variant="secondary"
              size="small"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              textStyle={{ color: '#FFFFFF' }}
            />
          </Card>
        </View>
      </ScrollView>

      <FloatingActionButton onPress={handleFABPress} />

      {/* Modals */}
      <AddMealModal
        visible={showAddMealModal}
        onClose={() => setShowAddMealModal(false)}
        onAddMeal={handleAddMeal}
      />

      <WaterLogModal
        visible={showWaterModal}
        onClose={() => setShowWaterModal(false)}
        onLogWater={handleLogWater}
        currentWater={waterConsumed}
        dailyGoal={waterGoal}
      />
    </SafeAreaView>
  );
}