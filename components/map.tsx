import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { PoinCollecteRecyclage } from '@/src/models/models';
import PointCollecteService from '@/services/pointCRService';
import { Utilisateur } from '@/src/models/models';
import UtilisateurService from '@/services/userService';
import { ActivityIndicator } from 'react-native';


let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  const mapLib = require('react-native-maps');
  MapView = mapLib.default;
  Marker = mapLib.Marker;
}

export default function Map() {
  const [points1, setPoints1] = useState<PoinCollecteRecyclage[]>([]);
  const [points3, setPoints3] = useState<PoinCollecteRecyclage[]|null>(null);
  const [points2, setPoints2] = useState<Utilisateur>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    PointCollecteService.getPoinCollecteRecyclages()
      .then(setPoints1)
      .catch(console.error);
  }, []);

   useEffect(() => {
    PointCollecteService.getPointRecyclages()
      .then(setPoints3)
      .catch(console.error);
  }, []);
// console.log("les point3",points3)
  useEffect(() => {
    UtilisateurService.getProfil()
      .then(response => {
        setPoints2(response.data);
      })
      .catch(console.error);
  }, []);

  const initialRegion = points2 ? {
    latitude: points2.latitude,
    longitude: points2.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 1,
    longitudeDelta: 1,
  };

  // if (Platform.OS === 'web') {
  //   return (
  //     <View style={styles.fallback}>
  //       <Text style={styles.text}>La carte n'est pas disponible sur le Web.</Text>
  //     </View>
  //   );
  // }

  return (
  points2 ? (
    <MapView style={styles.map} initialRegion={initialRegion}>
      {points1.map(point => (
        <Marker
          key={`p1-${point.id}`}
          coordinate={{ latitude: point.latitude, longitude: point.longitude }}
          title={point.descriptif}
          pinColor="green"
        />
      ))}

       {points3?.map(point3 => (
        <Marker
          key={`p3-${point3.id}`}
          coordinate={{ latitude: point3.latitude, longitude: point3.longitude }}
          title={point3.descriptif}
          pinColor="red"
        />
      ))}

      {points2 && (
        <Marker
          coordinate={{ latitude: points2.latitude, longitude: points2.longitude }}
          title={points2.name}
          pinColor="blue"
          
        />
      )}
    </MapView>
  ) : (
    <View style={{flex:1, backgroundColor:'white', display:'flex', alignContent:'center',alignItems:"center"} }>
     <ActivityIndicator size="large" color="green"  />
    </View>
  )
);

}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
