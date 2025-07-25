import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const { width, height } = Dimensions.get('window');

type ScanMode = 'barcode' | 'food' | 'manual';

interface ScanResult {
  type: 'barcode' | 'food';
  data: string;
  confidence?: number;
}

export default function Scanner() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>('barcode');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (isScanning) return;
    
    setIsScanning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setScanResult({ type: 'barcode', data });
    
    // Simulate API call to get product info
    setTimeout(() => {
      setIsScanning(false);
      Alert.alert(
        'Product Found!',
        `Barcode: ${data}\nProduct information retrieved successfully.`,
        [
          { text: 'Scan Again', onPress: () => setScanResult(null) },
          { text: 'Add to Journal', onPress: () => handleAddToJournal(data) },
        ]
      );
    }, 1000);
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    
    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      
      // Simulate AI food recognition
      setTimeout(() => {
        setIsProcessing(false);
        setScanResult({ 
          type: 'food', 
          data: 'Grilled Chicken Breast', 
          confidence: 0.92 
        });
        
        Alert.alert(
          'Food Recognized!',
          'Grilled Chicken Breast (92% confidence)\nEstimated: 231 calories, 43g protein',
          [
            { text: 'Try Again', onPress: () => setScanResult(null) },
            { text: 'Add to Journal', onPress: () => handleAddToJournal('Grilled Chicken Breast') },
          ]
        );
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setIsProcessing(true);
      
      // Simulate AI processing
      setTimeout(() => {
        setIsProcessing(false);
        setScanResult({ 
          type: 'food', 
          data: 'Mixed Salad', 
          confidence: 0.87 
        });
        
        Alert.alert(
          'Food Recognized!',
          'Mixed Salad (87% confidence)\nEstimated: 150 calories, 8g protein',
          [
            { text: 'Try Again', onPress: () => setScanResult(null) },
            { text: 'Add to Journal', onPress: () => handleAddToJournal('Mixed Salad') },
          ]
        );
      }, 2000);
    }
  };

  const handleManualEntry = () => {
    if (!manualCode.trim()) {
      Alert.alert('Error', 'Please enter a barcode number.');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate manual barcode lookup
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Product Found!',
        `Manual entry: ${manualCode}\nProduct information retrieved successfully.`,
        [
          { text: 'Clear', onPress: () => setManualCode('') },
          { text: 'Add to Journal', onPress: () => handleAddToJournal(manualCode) },
        ]
      );
    }, 1000);
  };

  const handleAddToJournal = (data: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success!', `${data} has been added to your journal.`);
    setScanResult(null);
    setManualCode('');
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FFFFFF' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: isDark ? '#FFFFFF' : '#212121' }}>
            Requesting camera permission...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#FFFFFF' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="camera-outline" size={64} color={isDark ? '#666666' : '#CCCCCC'} />
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: isDark ? '#FFFFFF' : '#212121',
              textAlign: 'center',
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            Camera Access Required
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter',
              color: isDark ? '#CCCCCC' : '#666666',
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            Please grant camera permission to scan barcodes and recognize food.
          </Text>
          <Button
            title="Grant Permission"
            onPress={getCameraPermissions}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

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
          Smart Scanner
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Inter',
            color: isDark ? '#CCCCCC' : '#666666',
          }}
        >
          Scan barcodes or recognize food with AI
        </Text>
      </View>

      {/* Mode Selector */}
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
            { key: 'barcode', label: 'Barcode', icon: 'barcode' },
            { key: 'food', label: 'Food AI', icon: 'camera' },
            { key: 'manual', label: 'Manual', icon: 'create' },
          ].map((mode) => (
            <TouchableOpacity
              key={mode.key}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: scanMode === mode.key
                  ? '#4CAF50'
                  : 'transparent',
              }}
              onPress={() => {
                setScanMode(mode.key as ScanMode);
                setScanResult(null);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons
                name={mode.icon as keyof typeof Ionicons.glyphMap}
                size={18}
                color={scanMode === mode.key
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
                  color: scanMode === mode.key
                    ? '#FFFFFF'
                    : isDark
                    ? '#CCCCCC'
                    : '#666666',
                }}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Scanner Content */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {scanMode === 'manual' ? (
          <Card style={{ padding: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Inter',
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : '#212121',
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              Enter Barcode Manually
            </Text>
            
            <TextInput
              style={{
                backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                fontFamily: 'Inter',
                color: isDark ? '#FFFFFF' : '#212121',
                marginBottom: 20,
                textAlign: 'center',
              }}
              placeholder="Enter barcode number..."
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={manualCode}
              onChangeText={setManualCode}
              keyboardType="numeric"
            />
            
            <Button
              title={isProcessing ? 'Looking up...' : 'Look Up Product'}
              onPress={handleManualEntry}
              disabled={isProcessing || !manualCode.trim()}
              variant="primary"
            />
          </Card>
        ) : (
          <View style={{ flex: 1 }}>
            {/* Camera View */}
            <View
              style={{
                flex: 1,
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: '#000000',
              }}
            >
              <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing="back"
                flash={flashEnabled ? 'on' : 'off'}
                onBarcodeScanned={scanMode === 'barcode' ? handleBarcodeScanned : undefined}
                barcodeScannerSettings={{
                  barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
                }}
              >
                {/* Overlay */}
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
                  {/* Scanning Frame */}
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: width * 0.7,
                        height: scanMode === 'barcode' ? 120 : width * 0.7,
                        borderWidth: 2,
                        borderColor: scanResult ? '#4CAF50' : '#FFFFFF',
                        borderRadius: 16,
                        backgroundColor: 'transparent',
                      }}
                    />
                    
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Inter',
                        fontWeight: '500',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        marginTop: 20,
                        paddingHorizontal: 40,
                      }}
                    >
                      {isProcessing
                        ? 'Processing...'
                        : scanMode === 'barcode'
                        ? 'Position barcode within the frame'
                        : 'Position food within the frame and tap to capture'
                      }
                    </Text>
                  </View>

                  {/* Controls */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      paddingBottom: 40,
                      paddingHorizontal: 40,
                    }}
                  >
                    {/* Flash Toggle */}
                    <TouchableOpacity
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={toggleFlash}
                    >
                      <Ionicons
                        name={flashEnabled ? 'flash' : 'flash-off'}
                        size={24}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>

                    {/* Capture Button (Food Mode) */}
                    {scanMode === 'food' && (
                      <TouchableOpacity
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 35,
                          backgroundColor: '#4CAF50',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 4,
                          borderColor: '#FFFFFF',
                        }}
                        onPress={handleTakePhoto}
                        disabled={isProcessing}
                      >
                        <Ionicons
                          name="camera"
                          size={32}
                          color="#FFFFFF"
                        />
                      </TouchableOpacity>
                    )}

                    {/* Gallery Button */}
                    <TouchableOpacity
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={handlePickImage}
                    >
                      <Ionicons
                        name="images"
                        size={24}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </CameraView>
            </View>

            {/* Status Indicator */}
            {(isScanning || isProcessing) && (
              <View
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  right: 20,
                  backgroundColor: 'rgba(76, 175, 80, 0.9)',
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name="scan"
                  size={20}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Inter',
                    fontWeight: '500',
                    color: '#FFFFFF',
                  }}
                >
                  {isProcessing ? 'Processing...' : 'Scanning...'}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}