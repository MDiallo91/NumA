import React, { useCallback, useMemo } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  ramassages?: any[] | null;
  refSheet: React.RefObject<BottomSheet|null>;
};

const RamassageBottomSheet = ({ ramassages, refSheet }: Props) => {
  const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('BottomSheet index:', index);
  }, []);

  return (
    <BottomSheet
      ref={refSheet}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>Liste des ramassages</Text>
        {ramassages && ramassages.length > 0 ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            {ramassages.map((item) => (
              <View key={item.id.toString()} style={styles.item}>
                <View style={styles.ramassageInfoView}>
                  <MaterialCommunityIcons
                    style={styles.icons}
                    name="map-marker-outline"
                    size={20}
                    color="green"
                  />
                  <Text style={styles.label}>Point de collecte:</Text>
                  <Text>{item.point_c_r.descriptif}</Text>
                </View>

                <View style={styles.ramassageInfoView}>
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={20}
                    color="green"
                  />
                  <Text style={styles.label}>Type déchets:</Text>
                  <Text>{item.type_dechet.nom}</Text>
                </View>

                <View style={styles.ramassageInfoView}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={20}
                    color="green"
                  />
                  <Text style={styles.label}>Statut:</Text>
                  <Text>{item.statut}</Text>
                </View>

                <View style={styles.ramassageInfoView}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="green"
                  />
                  <Text style={styles.label}>Date:</Text>
                  <Text>{new Date(item.datePrevue).toLocaleDateString()}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text>Aucun ramassage disponible</Text>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    marginBottom:20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: 'green',
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
  },
  icons: {
    marginRight: 6,
  },
  ramassageInfoView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    marginLeft: 4,
    marginRight: 4,
  },
});

export default RamassageBottomSheet;
