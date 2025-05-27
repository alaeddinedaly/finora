import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { useRef, useState } from "react";
import { info } from "@/constants/welcoming-info";
import CustomButton from "@/components/CustomButton";

const Welcome = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === info.length - 1;
  return (
    <SafeAreaView
      className={"flex flex-1 h-full items-center justify-between bg-white"}
    >
      <TouchableOpacity
        onPress={() => {
          router.replace("/(auth)/sign_up");
        }}
        className={"w-full flex justify-end items-end p-5"}
      >
        <Text className={"text-black font-bold"}>Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className={"w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full"} />
        }
        activeDot={
          <View className={"w-[32px] h-[4px] mx-1 bg-[#5c9fef] rounded-full"} />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {info.map((item) => (
          <View
            key={item.id}
            className={"flex items-center justify-center p-5"}
          >
            <Image
              source={item.image}
              className={"w-full h-[300px]"}
              resizeMode={"contain"}
            />
            <View
              className={
                "flex flex-row items-center justify-center w-full mt-10"
              }
            >
              <Text
                className={"text-black text-3xl font-bold mx-10 text-center"}
              >
                {item.title}
              </Text>
            </View>
            <View>
              <Text
                className={
                  "text-md font-semibold text-center text-[#858585] mx-10 mt-3"
                }
              >
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </Swiper>
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/sign_up")
            : swiperRef.current?.scrollTo(activeIndex + 1)
        }
        className={"w-3/4 mt-10 mb-5 ml-2 mr-2 bg-[#5c9fef] rounded-full"}
      />
    </SafeAreaView>
  );
};

export default Welcome;
