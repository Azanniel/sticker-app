import { useEffect, useState, useRef } from 'react';
import { Image, SafeAreaView, ScrollView, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing'

import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { PositionChoice } from '../components/PositionChoice';

import { styles } from './styles';
import { POSITIONS, PositionProps } from '../utils/positions';

export function Home() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [photo, setPhoto] = useState<null | string>(null)
  const [positionSelected, setPositionSelected] = useState<PositionProps>(POSITIONS[0]);

  const cameraRef = useRef<Camera>(null)
  const screenshotRef = useRef<View>(null)

  async function handleTakePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    setPhoto(photo.uri)
  }

  async function shareScreenShot() {
    const screenshot = await captureRef(screenshotRef.current);
    await Sharing.shareAsync("file://" + screenshot);
  }

  useEffect(() => {
    Camera.requestCameraPermissionsAsync()
    .then(response => setHasCameraPermission(response.granted))
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.sticker} ref={screenshotRef}>
          <Header position={positionSelected} />

          <View style={styles.picture}>

            {
              hasCameraPermission && !photo
                ? <Camera
                    ref={cameraRef}
                    style={styles.camera} 
                    type={CameraType.front}
                    ratio="1:1" 
                  /> 
                : <Image 
                    style={styles.preview} 
                    source={{ uri: photo ? photo : 'https://filestore.community.support.microsoft.com/api/images/490b996b-e45f-4985-b2af-cf36da33849a?upload=true' }} 
                    onLoad={() => setTimeout(() => shareScreenShot(), 500)}
                  />
            }

            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui..."
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />

        <TouchableOpacity activeOpacity={.7} onPress={() => setPhoto(null)}>
          <Text style={styles.retry}>Nova foto</Text>
        </TouchableOpacity>

        <Button title="Compartilhar" onPress={handleTakePicture} />
      </ScrollView>
    </SafeAreaView>
  );
}