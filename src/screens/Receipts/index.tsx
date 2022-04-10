import React, { useState } from "react";
import { Alert, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import storage from "@react-native-firebase/storage";

import { Container, PhotoInfo } from "./styles";
import { Header } from "../../components/Header";
import { Photo } from "../../components/Photo";
import { File, FileProps } from "../../components/File";

export function Receipts() {
  const [photos, setPhotos] = useState<FileProps[]>([]);
  const [photoSelected, setPhotoSelected] = useState("");
  const [photoInfo, setPhotoInfo] = useState("");

  function fetchImages() {
    storage()
      .ref("/images")
      .list()
      .then((response) => {
        const files: FileProps[] = [];
        response.items.forEach((file) => {
          files.push({
            name: file.name,
            path: file.fullPath,
          });
        });
        setPhotos(files);
      });
  }
  useFocusEffect(() => {
    fetchImages();
  });
  async function handleShowImage(path: string) {
    const urlImage = await storage().ref(path).getDownloadURL();
    setPhotoSelected(urlImage);

    const info = await storage().ref(path).getMetadata();
    setPhotoInfo(`Imagem selecionada: ${info.name}`);
  }

  async function handleDeleteImage(path: string) {
    storage()
      .ref(path)
      .delete()
      .then((response) => {
        Alert.alert("Imagem excluída com sucesso!");
        fetchImages();
      })
      .catch((error) => console.log(error));
  }

  return (
    <Container>
      <Header title="Comprovantes" />

      <Photo uri={photoSelected} />

      <PhotoInfo>{photoInfo}</PhotoInfo>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <File
            data={item}
            onShow={() => handleShowImage(item.path)}
            onDelete={() => handleDeleteImage(item.path)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%", padding: 24 }}
      />
    </Container>
  );
}
