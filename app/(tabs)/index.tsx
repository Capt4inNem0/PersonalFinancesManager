import {
  Image,
  StyleSheet,
  Platform,
  Alert,
  Button,
  View,
  Pressable,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {SQLiteDatabase, SQLiteProvider, useSQLiteContext} from "expo-sqlite";
import {useEffect, useState} from "react";
import DBManager from "@/db/dbManager";
import {JournalManager} from "@/db/journalManager";
import {Journal} from "@/models/Journal";
import {TransactionManager} from "@/db/transactionManager";
import FloatingForm from "@/components/form/FloatingForm";
import TransactionInputForm from "@/components/form/TransactionInputForm";
import {Transaction, TransactionCreateData} from "@/models/Transaction";

export default function HomeScreen() {
  const db = useSQLiteContext();
  const journalManager = new JournalManager(db);
  const transactionManager = new TransactionManager(db);
  const [journal, setJournal] = useState<Journal | null>(null);
  const [amount, setAmount] = useState<number>(0.0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactionForm, setShowTransactionForm] = useState<boolean>(false);
  const [showEditTransactionForm, setShowEditTransactionForm] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    journalManager.list().then(journals => {
      if (journals.length > 0) {
        setJournal(journals[0]);
      } else {
        Alert.alert('No journals found, creating one');
        journalManager.create({name: 'default', closed: false}).then(result => {
          setJournal(result);
        })
      }
    });
  }, []);

  useEffect(() => {
    if (journal) {
      transactionManager.list_by_journal(journal.id).then(transactions => {
        setTransactions(transactions);
      });
    }
  }, [journal]);

  useEffect(() => {
    let total = 0.0;
    transactions.forEach(transaction => {
      total += transaction.amount;
    });
    setAmount(total);
  }, [transactions]);

  const longPressTransactionFactory = (data: Transaction) => {
    const longPressHandler = (event: any) => {
      setSelectedTransaction(data);
      setShowEditTransactionForm(true);
    }
    return longPressHandler;
  };

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CE0C', dark: '#1D3D47' }}>
        <ThemedView style={styles.headerContainer}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="subtitle">Dinero disponible:</ThemedText>
          </ThemedView>
          <ThemedView style={styles.totalContainer}>
            <ThemedText type="title">$ {amount}</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.transactionsContainer}>
          <ThemedText type="subtitle">Transacciones</ThemedText>
          {transactions.map(transaction => (
            <TouchableOpacity onLongPress={longPressTransactionFactory(transaction)} style={styles.stepContainer} key={transaction.id}>
              {/*<ThemedText type="subtitle">{transaction.create_date.toISOString()}</ThemedText>*/}
              <>
              <ThemedView>
                <ThemedText type="subtitle">{transaction.description}</ThemedText>
              </ThemedView>
              <ThemedView  style={styles.transactionRight}>
                <ThemedText type="subtitle">$ {transaction.amount}</ThemedText>
                <ThemedText type="default">{(new Date(transaction.create_date)).toLocaleDateString()}</ThemedText>
              </ThemedView>
              </>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ParallaxScrollView>
      { journal && (
        <Pressable style={styles.floatingButton} onPress={() => {setShowTransactionForm(true)}}>
          <ThemedText type={'subtitle'}>+</ThemedText>
        </Pressable>
      )}
      { journal && showTransactionForm && (
        <TransactionInputForm setDisplay={setShowTransactionForm} journalId={journal.id} onSuccess={(data: TransactionCreateData) => {
          transactionManager.create(data).then(transaction => {
            if (transaction) {
              setTransactions([...transactions, transaction]);
            }
          });
        }} defaultDescription={undefined} defaultAmount={undefined}/>
      )}
      { journal && showEditTransactionForm && selectedTransaction &&(
        <TransactionInputForm setDisplay={setShowEditTransactionForm} journalId={journal.id} onSuccess={(data: TransactionCreateData) => {
            transactionManager.update(selectedTransaction.id, data).then( transaction => {
              transactionManager.list().then(transactions => {
                setTransactions(transactions);
              })
            });
          }} defaultAmount={selectedTransaction.amount} defaultDescription={selectedTransaction.description} allowDelete={true} onDelete={(transaction) => {
            if (selectedTransaction) {
              transactionManager.delete(selectedTransaction.id).then(() => {
              transactionManager.list().then(transactions => {
                setTransactions(transactions);
              })
            });
            }
        }}/>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    color: '#212121'
  },
  totalContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  stepContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#212121',
  },
  transactionsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  transactionRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#008ce8',
    padding: 16,
    borderRadius: 20,
    margin: 16,
  }
});
