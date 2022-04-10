import React, { useState } from "react";
import { Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import { Container, Account, Title, Subtitle } from "./styles";
import { ButtonText } from "../../components/ButtonText";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignInAnonymously() {
    const { user } = await auth().signInAnonymously();
  }
  function handleCreateUserAccount() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        setEmail("");
        setPassword("");
        Alert.alert("Conta criada com sucesso");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("Este e-mail já está em uso!");
          setEmail("");
          setPassword("");
        }
        if (error.code === "auth/invalid-email") {
          Alert.alert("E-mail inválido!");
          setEmail("");
        }
      });
  }
  async function handleForgotPassword() {
    auth()
      .sendPasswordResetEmail(email)
      .then(() => Alert.alert("E-mail enviado"));
  }

  function handleSignInWithEmailAndPassword() {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => console.log(response.user))
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          return Alert.alert("E-mail não cadastrado");
        }
        if (error.code === "auth/wrong-password") {
          return Alert.alert("Password não confere");
        }
      });
  }

  return (
    <Container>
      <Title>MyShopping</Title>
      <Subtitle>monte sua lista de compra te ajudar nas compras</Subtitle>

      <Input
        placeholder="e-mail"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />

      <Input
        placeholder="senha"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Button title="Entrar" onPress={handleSignInWithEmailAndPassword} />

      <Account>
        <ButtonText title="Recuperar senha" onPress={handleForgotPassword} />
        <ButtonText
          title="Criar minha conta"
          onPress={handleCreateUserAccount}
        />
      </Account>
    </Container>
  );
}
