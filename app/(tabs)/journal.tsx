import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import * as Haptics from 'expo-haptics';

interface JournalEntry {
  id: string;
  date: string;
  meals: {
    breakfast: { name: string; calories: number }[];
    lunch: { name: string; calories: number }[];
    dinner: { name: string; calories: number }[];
    snacks: { name: string; calories: number }[];
  };
  totalCalories: number;
  notes?: string;
}

export default function Journal() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snacks'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'calories'>('date');

  const [journalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2024-01-25',
      meals: {
        breakfast: [{ name: 'Avocado Toast', calories: 320 }, { name: 'Coffee', calories: 5 }],
        lunch: [{ name: 'Greek Salad', calories: 450 }],
        dinner: [{ name: 'Grilled Salmon', calories: 520 }, { name: 'Quinoa', calories: 180 }],
        snacks: [{ name: 'Protein Smoothie', calories: 280 }],
      },
      totalCalories: 1755,
      notes: 'Felt energetic throughout the day. Good protein intake.',
    },
    {
      id: '2',
      date: '2024-01-24',
      meals: {
        breakfast: [{ name: 'Oatmeal', calories: 280 }, { name: 'Berries', calories: 60 }],
        lunch: [{ name: 'Chicken Wrap', calories: 420 }],
        dinner: [{ name: 'Pasta', calories: 380 }, { name: 'Salad', calories: 120 }],
        snacks: [{ name: 'Apple', calories: 80 }, { name: 'Nuts', calories: 160 }],
      },
      totalCalories: 1500,
      notes: 'Light day, focused on whole foods.',
    },
  ]);

  const filters = [
    { key: 'all', label: 'All', icon: 'list' },
    { key: 'breakfast', label: 'Breakfast', icon: 'sunny' },
    { key: 'lunch', label: 'Lunch', icon: 'partly-sunny' },
    { key: 'dinner', label: 'Dinner', icon: 'moon' },
    { key: 'snacks', label: 'Snacks', icon: 'cafe' },
  ] as const;

  const handleExport = (format: 'pdf' | 'csv') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Implement export functionality
    console.log(`Exporting as ${format.toUpperCase()}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMealsByFilter = (entry: JournalEntry) => {
    if (selectedFilter === 'all') {
      return [
        ...entry.meals.breakfast,
        ...entry.meals.lunch,
        ...entry.meals.dinner,
        ...entry.meals.snacks,
      ];
    }
    return entry.meals[selectedFilter] || [];
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FFFFFF' }}>
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
          Food Journal
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Inter',
            color: isDark ? '#CCCCCC' : '#666666',
          }}
        >
          Track your nutrition history
        </Text>
      </View>

      {/* Search and Filters */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        {/* Search Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 16,
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color={isDark ? '#CCCCCC' : '#666666'}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: 'Inter',
              color: isDark ? '#FFFFFF' : '#212121',
            }}
            placeholder="Search meals..."
            placeholderTextColor={isDark ? '#666666' : '#999999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginHorizontal: 4,
                borderRadius: 20,
                backgroundColor: selectedFilter === filter.key
                  ? '#4CAF50'
                  : isDark
                  ? '#1E1E1E'
                  : '#F5F5F5',
              }}
              onPress={() => {
                setSelectedFilter(filter.key);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons
                name={filter.icon}
                size={16}
                color={selectedFilter === filter.key
                  ? '#FFFFFF'
                  : isDark
                  ? '#CCCCCC'
                  : '#666666'
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  color: selectedFilter === filter.key
                    ? '#FFFFFF'
                    : isDark
                    ? '#CCCCCC'
                    : '#666666',
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Export Controls */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            title="Export PDF"
            onPress={() => handleExport('pdf')}
            variant="secondary"
            size="small"
            icon={<Ionicons name="document-text" size={16} color={isDark ? '#FFFFFF' : '#212121'} />}
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            title="Export CSV"
            onPress={() => handleExport('csv')}
            variant="secondary"
            size="small"
            icon={<Ionicons name="grid" size={16} color={isDark ? '#FFFFFF' : '#212121'} />}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </View>

      {/* Journal Entries */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {journalEntries.map((entry) => (
          <Card key={entry.id} style={{ marginBottom: 16 }}>
            {/* Date Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? '#333333' : '#E5E5E5',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  color: isDark ? '#FFFFFF' : '#212121',
                }}
              >
                {formatDate(entry.date)}
              </Text>
              <View
                style={{
                  backgroundColor: '#4CAF5020',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#4CAF50',
                  }}
                >
                  {entry.totalCalories} cal
                </Text>
              </View>
            </View>

            {/* Meals */}
            <View style={{ marginBottom: 16 }}>
              {Object.entries(entry.meals).map(([mealType, meals]) => {
                if (selectedFilter !== 'all' && selectedFilter !== mealType) return null;
                if (meals.length === 0) return null;

                const getMealIcon = (type: string) => {
                  switch (type) {
                    case 'breakfast': return 'sunny';
                    case 'lunch': return 'partly-sunny';
                    case 'dinner': return 'moon';
                    case 'snacks': return 'cafe';
                    default: return 'restaurant';
                  }
                };

                return (
                  <View key={mealType} style={{ marginBottom: 12 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <Ionicons
                        name={getMealIcon(mealType)}
                        size={16}
                        color="#4CAF50"
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Inter',
                          fontWeight: '500',
                          color: isDark ? '#FFFFFF' : '#212121',
                          textTransform: 'capitalize',
                        }}
                      >
                        {mealType}
                      </Text>
                    </View>
                    
                    {meals.map((meal, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingLeft: 24,
                          paddingVertical: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Inter',
                            color: isDark ? '#CCCCCC' : '#666666',
                            flex: 1,
                          }}
                        >
                          {meal.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Inter',
                            fontWeight: '500',
                            color: '#4CAF50',
                          }}
                        >
                          {meal.calories} cal
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>

            {/* Notes */}
            {entry.notes && (
              <View
                style={{
                  backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA',
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <Ionicons
                    name="document-text"
                    size={16}
                    color={isDark ? '#CCCCCC' : '#666666'}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Inter',
                      fontWeight: '500',
                      color: isDark ? '#CCCCCC' : '#666666',
                    }}
                  >
                    Notes
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Inter',
                    color: isDark ? '#FFFFFF' : '#212121',
                    lineHeight: 20,
                  }}
                >
                  {entry.notes}
                </Text>
              </View>
            )}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}