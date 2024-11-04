import {Pressable, StyleSheet, Text, View} from "react-native";
import {ThemedView} from "@/components/ThemedView";

const Button = ({ title, onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  )
}

const FloatingForm = ({children, setDisplay, onSuccess, extraButtons, ...props }) => {

  const successManager = () => {
    setDisplay(false);
    onSuccess();
  }

  return (
    <View style={styles.floatingFormContainer} {...props}>
      <ThemedView style={styles.floatingForm}>
        {children}
        <View style={styles.inlineButtons}>
          <Button title="Guardar" onPress={successManager} />
          {extraButtons.map((button, index) => (
            <Button key={index} title={button.title} onPress={button.onPress} />
          ))}
          <Button title="Cancelar" onPress={() => setDisplay(false)} />
        </View>
      </ThemedView>
    </View>
  )
}

const styles = StyleSheet.create({
  floatingFormContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center',
  },
  floatingForm: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    margin: 10,
    borderColor: "#212121",
    borderWidth: 1,
  },
  inlineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#212121',
    width: '30%',
    padding: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  }
});

export default FloatingForm;