import React from "react";
import {
  View,
  Dimensions,
  Animated,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  Alert,
} from "react-native";
import CreditCard from "@/components/CreditCard";
import { useUser } from "@clerk/clerk-expo";
import { deleteCard } from "@/services/CardServices";

const { height: screenHeight } = Dimensions.get("window");
const CARD_HEIGHT = 200;
const SPACING = 5;

interface VerticalCardSliderProps {
  cards: any[];
  onDeleteCard: (cardName: string) => void;
}

const VerticalCardSlider = ({
  cards,
  onDeleteCard,
}: VerticalCardSliderProps) => {
  const { user } = useUser();
  const userId = user?.id.toString();

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const flatListRef = React.useRef<FlatList>(null);

  const spacerHeight = (screenHeight - CARD_HEIGHT) / 2;

  const dataWithSpacers = [
    { id: "top-spacer", spacer: true },
    ...cards.map((c, i) => ({ ...c, id: `card-${i}` })),
    { id: "bottom-spacer", spacer: true },
  ];

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const cardFullSize = CARD_HEIGHT + SPACING;
    const index = Math.round(offsetY / cardFullSize);
    const snapOffset = index * cardFullSize;

    // Only snap if we're not already at the correct position
    if (Math.abs(snapOffset - offsetY) > 1) {
      flatListRef.current?.scrollToOffset({
        offset: snapOffset,
        animated: true,
      });
    }
  };

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={dataWithSpacers}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      decelerationRate="fast"
      bounces={false}
      snapToInterval={CARD_HEIGHT + SPACING}
      snapToAlignment="center"
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true },
      )}
      onScrollEndDrag={handleScrollEnd}
      onMomentumScrollEnd={handleScrollEnd}
      renderItem={({ item, index }) => {
        if (item.spacer) {
          return <View style={{ height: spacerHeight }} />;
        }

        const cardFullSize = CARD_HEIGHT + SPACING;
        const inputRange = [
          cardFullSize * (index - 2),
          cardFullSize * (index - 1),
          cardFullSize * index,
        ];

        const scale = scrollY.interpolate({
          inputRange,
          outputRange: [0.9, 1.15, 0.9],
          extrapolate: "clamp",
        });

        const opacity = scrollY.interpolate({
          inputRange,
          outputRange: [0.5, 1, 0.5],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            style={{
              transform: [{ scale }],
              opacity,
              marginBottom: SPACING,
              alignSelf: "center",
              height: CARD_HEIGHT,
            }}
          >
            <Pressable
              onLongPress={() => {
                Alert.alert(
                  "Delete Card",
                  "Are you sure you want to delete this card?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          const result = await deleteCard(userId, item.name);
                          if (result) {
                            Alert.alert("Success", "Card deleted successfully");
                            onDeleteCard(item.name);
                          } else {
                            Alert.alert("Error", "Failed to delete Card");
                          }
                        } catch (error) {
                          Alert.alert(
                            "Error",
                            "An error occurred while deleting the Card",
                          );
                          console.error(error);
                        }
                      },
                    },
                  ],
                );
              }}
              delayLongPress={600}
            >
              <CreditCard card={item} />
            </Pressable>
          </Animated.View>
        );
      }}
    />
  );
};

export default VerticalCardSlider;
