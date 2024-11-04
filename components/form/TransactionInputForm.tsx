import {TextInput} from "react-native";
import FloatingForm from "@/components/form/FloatingForm";
import {ThemedText} from "@/components/ThemedText";
import {type PropsWithChildren, useEffect, useState} from "react";
import {Transaction, TransactionCreateData} from "@/models/Transaction";

type Props = PropsWithChildren<{
  setDisplay: (display: boolean) => void;
  onSuccess: (data: TransactionCreateData) => void;
  journalId: number;
  defaultAmount?: number;
  defaultDescription?: string;
  allowDelete?: boolean;
  onDelete?: (data: Transaction) => void;
  onCancel?: () => void;
}>;

const TransactionInputForm = ({setDisplay, onSuccess, journalId, defaultAmount=undefined, defaultDescription=undefined, allowDelete=false, onDelete, onCancel, ...props}: Props) => {
  const [amount, setAmount] = useState(`${defaultAmount ?? ""}`);
  const [description, setDescription] = useState(`${defaultDescription ?? ""}`);
  const [error, setError] = useState<string | null>(null);

  const amountValidator = () => {
    setError(null);
    if (isNaN(parseFloat(amount))) {
      setError("Amount must be a number");
    }
  }

  const successManager = () => {
    onSuccess({journal_id: journalId, amount: parseFloat(amount), description: description});
  }

  const onDeleteManager = () => {
    if (onDelete) {
      onDelete({id: 0, journal_id: journalId, amount: parseFloat(amount), description: description, create_date: new Date()});
    }
    setDisplay(false);
  }

  const extraButtons = allowDelete ? [{title: "Eliminar", onPress: onDeleteManager}] : [];

  return (
    <>
      <FloatingForm setDisplay={setDisplay} onSuccess={successManager} error={error} onCancel={onCancel} extraButtons={extraButtons}>
        <ThemedText type="subtitle">Añadir transacción</ThemedText>
        <TextInput placeholder="Descripción" value={description} onChangeText={setDescription}/>
        <TextInput placeholder="Importe" value={amount} onChangeText={setAmount}/>
      </FloatingForm>
    </>
  )
}

export default TransactionInputForm;