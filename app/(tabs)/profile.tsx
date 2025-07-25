import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import * as Haptics from 'expo-haptics';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function Profile() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [darkMode, setDarkMode] = useState(isDark);
  const [notifications, setNotifications] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [voiceCommands, setVoiceCommands] = useState(false);

  const userStats = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    joinDate: 'January 2024',
    streak: 12,
    totalMeals: 156,
    caloriesTracked: 234500,
  };

  const integrations = [
    { name: 'Google Fit', connected: true, icon: 'fitness' as keyof typeof Ionicons.glyphMap },
    { name: 'Apple Health', connected: false, icon: 'heart' as keyof typeof Ionicons.glyphMap },
    { name: 'Fitbit', connected: true, icon: 'watch' as keyof typeof Ionicons.glyphMap },
    { name: 'Garmin', connected: false, icon: 'speedometer' as keyof typeof Ionicons.glyphMap },
  ];

  const settingSections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme',
          icon: 'moon',
          type: 'toggle',
          value: darkMode,
          onToggle: (value) => {
            setDarkMode(value);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Meal reminders and tips',
          icon: 'notifications',
          type: 'toggle',
          value: notifications,
          onToggle: (value) => {
            setNotifications(value);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
        {
          id: 'haptic',
          title: 'Haptic Feedback',
          subtitle: 'Vibration on interactions',
          icon: 'phone-portrait',
          type: 'toggle',
          value: hapticFeedback,
          onToggle: (value) => {
            setHapticFeedback(value);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
        {
          id: 'voice',
          title: 'Voice Commands',
          subtitle: 'Enable voice meal entry',
          icon: 'mic',
          type: 'toggle',
          value: voiceCommands,
          onToggle: (value) => {
            setVoiceCommands(value);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'goals',
          title: 'Nutrition Goals',
          subtitle: 'Set your daily targets',
          icon: 'flag',
          type: 'navigation',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Coming Soon', 'Nutrition goals customization will be available soon.');
          },
        },
        {
          id: 'dietary',
          title: 'Dietary Preferences',
          subtitle: 'Allergies and restrictions',
          icon: 'restaurant',
          type: 'navigation',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Coming Soon', 'Dietary preferences will be available soon.');
          },
        },
        {
          id: 'export',
          title: 'Export Data',
          subtitle: 'Download your nutrition data',
          icon: 'download',
          type: 'action',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Alert.alert('Export Data', 'Your data will be exported as a CSV file.');
          },
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & FAQ',
          subtitle: 'Get help using the app',
          icon: 'help-circle',
          type: 'navigation',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Help', 'Help documentation will be available soon.');
          },
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve',
          icon: 'chatbubble',
          type: 'action',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Feedback', 'Thank you for your interest in providing feedback!');
          },
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: 'How we protect your data',
          icon: 'shield-checkmark',
          type: 'navigation',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Privacy', 'Privacy policy will be displayed here.');
          },
        },
      ],
    },
  ];

  const handleIntegrationToggle = (integrationName: string, currentStatus: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (currentStatus) {
      Alert.alert(
        'Disconnect Integration',
        `Are you sure you want to disconnect ${integrationName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Disconnect', style: 'destructive' },
        ]
      );
    } else {
      Alert.alert(
        'Connect Integration',
        `Connect to ${integrationName} to sync your health data automatically.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Connect', onPress: () => {} },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FFFFFF' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
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
            Profile
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter',
              color: isDark ? '#CCCCCC' : '#666666',
            }}
          >
            Manage your account and preferences
          </Text>
        </View>

        {/* User Info Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Card>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#4CAF50',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 32,
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#FFFFFF',
                  }}
                >
                  {userStats.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  color: isDark ? '#FFFFFF' : '#212121',
                  marginBottom: 4,
                }}
              >
                {userStats.name}
              </Text>
              
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Inter',
                  color: isDark ? '#CCCCCC' : '#666666',
                  marginBottom: 16,
                }}
              >
                {userStats.email}
              </Text>
              
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Inter',
                  color: isDark ? '#888888' : '#999999',
                }}
              >
                Member since {userStats.joinDate}
              </Text>
            </View>

            {/* Stats */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: isDark ? '#333333' : '#E5E5E5',
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#4CAF50',
                    marginBottom: 4,
                  }}
                >
                  {userStats.streak}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Inter',
                    color: isDark ? '#CCCCCC' : '#666666',
                  }}
                >
                  Day Streak
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#4CAF50',
                    marginBottom: 4,
                  }}
                >
                  {userStats.totalMeals}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Inter',
                    color: isDark ? '#CCCCCC' : '#666666',
                  }}
                >
                  Meals Logged
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    color: '#4CAF50',
                    marginBottom: 4,
                  }}
                >
                  {(userStats.caloriesTracked / 1000).toFixed(0)}k
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Inter',
                    color: isDark ? '#CCCCCC' : '#666666',
                  }}
                >
                  Calories Tracked
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Health Integrations */}
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
            Health Integrations
          </Text>
          
          <Card>
            {integrations.map((integration, index) => (
              <View key={integration.name}>
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
                      backgroundColor: integration.connected ? '#4CAF5020' : isDark ? '#333333' : '#F5F5F5',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Ionicons
                      name={integration.icon}
                      size={20}
                      color={integration.connected ? '#4CAF50' : isDark ? '#666666' : '#999999'}
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
                      {integration.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Inter',
                        color: integration.connected ? '#4CAF50' : isDark ? '#666666' : '#999999',
                      }}
                    >
                      {integration.connected ? 'Connected' : 'Not connected'}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={{
                      backgroundColor: integration.connected ? '#FF8C0020' : '#4CAF5020',
                      borderRadius: 16,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}
                    onPress={() => handleIntegrationToggle(integration.name, integration.connected)}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Inter',
                        fontWeight: '500',
                        color: integration.connected ? '#FF8C00' : '#4CAF50',
                      }}
                    >
                      {integration.connected ? 'Disconnect' : 'Connect'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {index < integrations.length - 1 && (
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

        {/* Settings Sections */}
        {settingSections.map((section) => (
          <View key={section.title} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Inter',
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : '#212121',
                marginBottom: 16,
              }}
            >
              {section.title}
            </Text>
            
            <Card>
              {section.items.map((item, index) => (
                <View key={item.id}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                    }}
                    onPress={item.onPress}
                    disabled={item.type === 'toggle'}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: isDark ? '#333333' : '#F5F5F5',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={isDark ? '#CCCCCC' : '#666666'}
                      />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Inter',
                          fontWeight: '500',
                          color: isDark ? '#FFFFFF' : '#212121',
                          marginBottom: item.subtitle ? 2 : 0,
                        }}
                      >
                        {item.title}
                      </Text>
                      {item.subtitle && (
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Inter',
                            color: isDark ? '#CCCCCC' : '#666666',
                          }}
                        >
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                    
                    {item.type === 'toggle' && item.onToggle && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: isDark ? '#333333' : '#E5E5E5', true: '#4CAF5080' }}
                        thumbColor={item.value ? '#4CAF50' : isDark ? '#666666' : '#FFFFFF'}
                      />
                    )}
                    
                    {item.type === 'navigation' && (
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={isDark ? '#666666' : '#CCCCCC'}
                      />
                    )}
                  </TouchableOpacity>
                  
                  {index < section.items.length - 1 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: isDark ? '#333333' : '#E5E5E5',
                        marginVertical: 4,
                        marginLeft: 52,
                      }}
                    />
                  )}
                </View>
              ))}
            </Card>
          </View>
        ))}

        {/* Sign Out Button */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Button
            title="Sign Out"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign Out', style: 'destructive' },
                ]
              );
            }}
            variant="secondary"
            style={{
              borderColor: '#FF6B6B',
            }}
            textStyle={{
              color: '#FF6B6B',
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}