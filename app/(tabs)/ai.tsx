import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAppNavigation } from '../../hooks/useNavigation';
import * as Haptics from 'expo-haptics';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'meal-plan';
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  calories: number;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function AI() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useAppNavigation();
  const params = useLocalSearchParams();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI nutrition assistant. I can help you with meal planning, nutrition advice, and tracking your health goals. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'planner' | 'insights'>((params.tab as any) || 'chat');
  
  const scrollViewRef = useRef<ScrollView>(null);

  const suggestions: Suggestion[] = [
    {
      id: '1',
      title: 'High Protein Breakfast',
      description: 'Greek yogurt with berries and granola',
      calories: 320,
      icon: 'sunny',
    },
    {
      id: '2',
      title: 'Balanced Lunch',
      description: 'Quinoa bowl with grilled chicken',
      calories: 450,
      icon: 'partly-sunny',
    },
    {
      id: '3',
      title: 'Light Dinner',
      description: 'Grilled salmon with vegetables',
      calories: 380,
      icon: 'moon',
    },
    {
      id: '4',
      title: 'Healthy Snack',
      description: 'Apple slices with almond butter',
      calories: 180,
      icon: 'cafe',
    },
  ];

  const quickPrompts = [
    "What should I eat for breakfast?",
    "Help me plan a weekly menu",
    "I need more protein in my diet",
    "Suggest low-calorie snacks",
    "How can I improve my nutrition?",
  ];

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('breakfast')) {
      return "For a nutritious breakfast, I recommend starting with protein and fiber. Try Greek yogurt with berries and nuts, or oatmeal with banana and almond butter. These options will keep you satisfied and provide sustained energy throughout the morning.";
    } else if (lowerInput.includes('protein')) {
      return "Great question! To increase your protein intake, consider adding lean meats, fish, eggs, legumes, or Greek yogurt to your meals. Aim for 20-30g of protein per meal. Would you like specific meal suggestions?";
    } else if (lowerInput.includes('menu') || lowerInput.includes('plan')) {
      return "I'd be happy to help you plan a weekly menu! Let's start with your goals and preferences. Are you looking to lose weight, gain muscle, or maintain your current health? Also, do you have any dietary restrictions I should know about?";
    } else if (lowerInput.includes('snack')) {
      return "Here are some healthy snack ideas: apple with almond butter (180 cal), Greek yogurt with berries (120 cal), handful of nuts (160 cal), or hummus with vegetables (100 cal). These provide good nutrition and will keep you satisfied between meals.";
    } else {
      return "That's a great question! Based on your current nutrition goals, I recommend focusing on whole foods, balanced macronutrients, and consistent meal timing. Would you like me to provide more specific guidance based on your individual needs?";
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderChatTab = () => (
    <View style={{ flex: 1 }}>
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={{
              alignSelf: message.isUser ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              marginBottom: 16,
            }}
          >
            <View
              style={{
                backgroundColor: message.isUser
                  ? '#4CAF50'
                  : isDark
                  ? '#1E1E1E'
                  : '#F5F5F5',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Inter',
                  color: message.isUser
                    ? '#FFFFFF'
                    : isDark
                    ? '#FFFFFF'
                    : '#212121',
                  lineHeight: 22,
                }}
              >
                {message.text}
              </Text>
            </View>
            
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Inter',
                color: isDark ? '#666666' : '#999999',
                marginTop: 4,
                alignSelf: message.isUser ? 'flex-end' : 'flex-start',
              }}
            >
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        ))}

        {isTyping && (
          <View
            style={{
              alignSelf: 'flex-start',
              maxWidth: '80%',
              marginBottom: 16,
            }}
          >
            <View
              style={{
                backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isDark ? '#666666' : '#CCCCCC',
                      marginHorizontal: 2,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: '500',
              color: isDark ? '#FFFFFF' : '#212121',
              marginBottom: 12,
            }}
          >
            Try asking:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {quickPrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginRight: 12,
                  borderWidth: 1,
                  borderColor: isDark ? '#333333' : '#E5E5E5',
                }}
                onPress={() => handleQuickPrompt(prompt)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Inter',
                    color: isDark ? '#CCCCCC' : '#666666',
                  }}
                >
                  {prompt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ paddingHorizontal: 20, paddingBottom: 20 }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 8,
            maxHeight: 120,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: 'Inter',
              color: isDark ? '#FFFFFF' : '#212121',
              paddingVertical: 8,
              maxHeight: 100,
            }}
            placeholder="Ask me about nutrition..."
            placeholderTextColor={isDark ? '#666666' : '#999999'}
            value={inputText}
            onChangeText={setInputText}
            multiline
            textAlignVertical="top"
          />
          
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: inputText.trim() ? '#4CAF50' : isDark ? '#333333' : '#CCCCCC',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 8,
            }}
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <Ionicons
              name="send"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );

  const renderPlannerTab = () => (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'Inter',
          fontWeight: '600',
          color: isDark ? '#FFFFFF' : '#212121',
          marginBottom: 16,
        }}
      >
        AI Meal Suggestions
      </Text>

      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#4CAF5020',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <Ionicons
                name={suggestion.icon}
                size={24}
                color="#4CAF50"
              />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  color: isDark ? '#FFFFFF' : '#212121',
                  marginBottom: 4,
                }}
              >
                {suggestion.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Inter',
                  color: isDark ? '#CCCCCC' : '#666666',
                  marginBottom: 8,
                }}
              >
                {suggestion.description}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  color: '#4CAF50',
                }}
              >
                {suggestion.calories} calories
              </Text>
            </View>
            
            <TouchableOpacity
              style={{
                backgroundColor: '#4CAF50',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert(
                  'Add to Journal',
                  `Add ${suggestion.title} to your meal journal?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Add', 
                      onPress: () => {
                        Alert.alert('Success!', `${suggestion.title} has been added to your journal.`);
                      }
                    },
                  ]
                );
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  color: '#FFFFFF',
                }}
              >
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}

      <Button
        title="Generate New Suggestions"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Alert.alert('Generating...', 'New AI suggestions are being generated based on your preferences and nutrition goals.');
        }}
        variant="primary"
        style={{ marginTop: 16 }}
      />
    </ScrollView>
  );

  const renderInsightsTab = () => (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'Inter',
          fontWeight: '600',
          color: isDark ? '#FFFFFF' : '#212121',
          marginBottom: 16,
        }}
      >
        Nutrition Insights
      </Text>

      <Card style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Ionicons name="trending-up" size={24} color="#4CAF50" />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: isDark ? '#FFFFFF' : '#212121',
              marginLeft: 8,
            }}
          >
            Weekly Progress
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter',
            color: isDark ? '#CCCCCC' : '#666666',
            lineHeight: 20,
          }}
        >
          You've been consistent with your nutrition goals this week! Your protein intake has improved by 15% compared to last week.
        </Text>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Ionicons name="warning" size={24} color="#FF8C00" />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: isDark ? '#FFFFFF' : '#212121',
              marginLeft: 8,
            }}
          >
            Recommendation
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter',
            color: isDark ? '#CCCCCC' : '#666666',
            lineHeight: 20,
          }}
        >
          Consider adding more vegetables to your meals. You're currently getting 3 servings per day, but 5-7 servings would be optimal for your health goals.
        </Text>
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Ionicons name="bulb" size={24} color="#9C27B0" />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: isDark ? '#FFFFFF' : '#212121',
              marginLeft: 8,
            }}
          >
            Personalized Tip
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter',
            color: isDark ? '#CCCCCC' : '#666666',
            lineHeight: 20,
          }}
        >
          Based on your activity level and goals, try eating your largest meal earlier in the day. This can help optimize your energy levels and metabolism.
        </Text>
      </Card>
    </ScrollView>
  );

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
          AI Assistant
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Inter',
            color: isDark ? '#CCCCCC' : '#666666',
          }}
        >
          Your personal nutrition coach
        </Text>
      </View>

      {/* Tab Selector */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
            borderRadius: 12,
            padding: 4,
          }}
        >
          {[
            { key: 'chat', label: 'Chat', icon: 'chatbubble-ellipses' },
            { key: 'planner', label: 'Planner', icon: 'calendar' },
            { key: 'insights', label: 'Insights', icon: 'analytics' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: activeTab === tab.key
                  ? '#4CAF50'
                  : 'transparent',
              }}
              onPress={() => {
                setActiveTab(tab.key as typeof activeTab);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons
                name={tab.icon as keyof typeof Ionicons.glyphMap}
                size={18}
                color={activeTab === tab.key
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
                  color: activeTab === tab.key
                    ? '#FFFFFF'
                    : isDark
                    ? '#CCCCCC'
                    : '#666666',
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tab Content */}
      {activeTab === 'chat' && renderChatTab()}
      {activeTab === 'planner' && renderPlannerTab()}
      {activeTab === 'insights' && renderInsightsTab()}
    </SafeAreaView>
  );
}