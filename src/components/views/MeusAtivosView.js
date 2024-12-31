    import React, { useCallback, useContext, useState } from "react";
    import { Alert, FlatList, Modal, StyleSheet, View } from "react-native";
    import { ActivityIndicator, Icon, Text, TextInput } from "react-native-paper";
    import { LogadoContext } from "../../context/LogadoContext";
    import { atualizaFavorito, buscaUserAtivos, vendeAtivos } from "../../services/ativoService";
    import { TouchableOpacity } from "react-native";
    import { useFocusEffect } from "@react-navigation/native";
    import { Logo } from "./Logo";
    
    // Página com os ativos do usuário
    export default MeusAtivosView = () => {
        const { userId, token } = useContext(LogadoContext);

        const [userAtivos, setUserAtivos] = useState([]);
        const [favoritos, setFavoritos] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
        const [isVisible, setIsVisible] = useState(false);
        const [ativoSelecionado, setAtivoSelecionado] = useState(null);
        const [modalError, setModalError] = useState(null);
        const [quantAtivo, setQuantAtivo] = useState("");

        const listaMeusAtivos = async () => {
            setError("");
            setModalError();
            setUserAtivos([]);
            setFavoritos([]);
            setLoading(true);

            try {
                const dados = await buscaUserAtivos(userId, token);

                const favoritosFiltrados = dados.filter((ativo) => ativo.isFavorito);
                const naoFavoritos = dados.filter((ativo) => !ativo.isFavorito);

                setFavoritos(favoritosFiltrados);
                setUserAtivos(naoFavoritos);
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false);
            }
        };

        const handleVenda = async () => {
            if (!quantAtivo || isNaN(quantAtivo)) {
                setModalError("Por favor, insira uma quantidade válida!");
                return;
            };
            if (Number(quantAtivo) > Number(ativoSelecionado.quantidade)) {
                setModalError(`Você possui apenas ${ativoSelecionado.quantidade} unidades desse ativo!`);
                return;
            };

            try {
                const { mudanca } = await vendeAtivos(ativoSelecionado, quantAtivo, userId, token);

                if (mudanca > 0) {
                    Alert.alert("Lucro", `Sua venda foi processada com lucro de R$ ${mudanca.toFixed(2)}`);
                } else if (mudanca == 0) {
                    Alert.alert("Venda realizada", `Sua venda foi processada sem lucro nem prejuízo.`);
                } else {
                    Alert.alert("Prejuízo", `Sua venda foi processada com prejuízo de R$ ${mudanca.toFixed(2)}`);
                }
            } catch (error) {
                setModalError(error.message);
            } finally {
                setIsVisible(false);
                listaMeusAtivos();
            }
        };

        const handleFavoritar = (atv) => {
            setError("");
            setModalError();

            Alert.alert(
                "Favoritos",
                `Deseja adicionar ${atv.ativo} ao seus favoritos?`,
                [
                    {
                        text: "Sim",
                        onPress: async () => {
                            try {
                                await atualizaFavorito(atv.id, true, token);
                                listaMeusAtivos();
                            } catch (error) {
                                setError(error.message);
                            }
                        }
                    },
                    {
                        text: "Não",
                        style: "cancel",
                    }
                ]
            );
        };

        const handleDesfavoritar = (atv) => {
            setError("");
            setModalError();

            Alert.alert(
                "Favoritos",
                `Deseja remover ${atv.ativo} dos seus favoritos?`,
                [
                    {
                        text: "Sim",
                        onPress: async () => {
                            try {
                                await atualizaFavorito(atv.id, false, token);
                                listaMeusAtivos();
                            } catch (error) {
                                setError(error.message);
                            }
                        }
                    },
                    {
                        text: "Não",
                        style: "cancel",
                    }
                ]
            );
        };

        useFocusEffect(
            useCallback(() => {
                listaMeusAtivos();
            },[])
        );

        return (
            <View style={styles.container}>
                {favoritos.length > 0 ? (
                    <>
                        <View style={styles.titulo_container}>
                            <Text style={styles.titulo}>Favoritos</Text>
                            <View style={{ marginTop: 20 }}>
                                <Icon 
                                    source="star"
                                    size={35}
                                    color="#fff"
                                />
                            </View>
                        </View>
                        <Text style={styles.subtitulo}>(pressione e segure para desfavoritar)</Text>

                        <FlatList 
                            data={favoritos}
                            numColumns={1}
                            keyExtractor={(item) => item.ativo}
                            renderItem={({ item }) => {
                                const change = item.change === "N/A" ? 0 : Number(item.change);
                                const icon_color = change > 0 ? '#24f07d' : (change < 0 ? '#f02424' : '#fff');
                                const icon = change > 0 ? 'trending-up' : (change < 0 ? 'trending-down' : 'trending-neutral');

                                return (
                                    <TouchableOpacity
                                        style={styles.favorito_container}
                                        onPress={() => {
                                            setAtivoSelecionado(item);
                                            setIsVisible(true);
                                        }}
                                        onLongPress={() => handleDesfavoritar(item)}
                                    >
                                        <Logo
                                            uri={item.logo}
                                            width={55}
                                            height={55}
                                        />
                                        <View style={styles.ativo_nome_container}>
                                            <Text style={styles.favorito_nome}>{item.ativo}</Text>
                                            <Text style={styles.favorito_tipo}>{item.tipo}</Text>
                                        </View>
                                        <View style={styles.ativo_quantidade_container}>
                                            <Text style={styles.favorito_quantidade}>Qtd.: {item.quantidade}</Text>
                                            <Text style={styles.favorito_valor}>R$ {Number(item.valor_compra).toFixed(2)}/unid.</Text>
                                        </View>
                                        <View style={styles.ativo_change_container}>
                                            <Icon
                                                source={icon}
                                                size={30}
                                                color={icon_color}
                                            />
                                            <Text style={[styles.ativo_change, { color: icon_color, } ]}>{Number(item.change).toFixed(2)}%</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                            contentContainerStyle={styles.flatlist}
                        />
                    </>
                ) : (
                    <></>
                )}

                <View style={styles.titulo_container}>
                    <Text style={styles.titulo}>Meus Ativos</Text>
                    <View style={{ marginTop: 20 }}>
                        <Icon 
                            source="piggy-bank"
                            size={35}
                            color="#fff"
                        />
                    </View>
                </View>
                <Text style={styles.subtitulo}>(pressione e segure para favoritar)</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#fff" />
                ) : (
                    <FlatList 
                        data={userAtivos}
                        numColumns={1}
                        keyExtractor={(item) => item.ativo}
                        renderItem={({ item }) => {
                            const change = item.change === "N/A" ? 0 : Number(item.change);
                            const icon_color = change > 0 ? '#24f07d' : (change < 0 ? '#f02424' : '#fff');
                            const icon = change > 0 ? 'trending-up' : (change < 0 ? 'trending-down' : 'trending-neutral');

                            return (
                                <TouchableOpacity
                                    style={styles.ativo_container}
                                    onPress={() => {
                                        setAtivoSelecionado(item);
                                        setIsVisible(true);
                                    }}
                                    onLongPress={() => handleFavoritar(item)}
                                >
                                    <Logo
                                        uri={item.logo}
                                        width={60}
                                        height={60}
                                    />
                                    <View style={styles.ativo_nome_container}>
                                        <Text style={styles.ativo_nome}>{item.ativo}</Text>
                                        <Text style={styles.ativo_tipo}>{item.tipo}</Text>
                                    </View>
                                    <View style={styles.ativo_quantidade_container}>
                                        <Text style={styles.ativo_quantidade}>Qtd: {item.quantidade}</Text>
                                        <Text style={styles.ativo_valor}>R$ {Number(item.valor_compra).toFixed(2)}/unid.</Text>
                                    </View>
                                    <View style={styles.ativo_change_container}>
                                        <Icon
                                            source={icon}
                                            size={30}
                                            color={icon_color}
                                        />
                                        <Text style={[styles.ativo_change, { color: icon_color } ]}>{Number(item.change).toFixed(2)}%</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        contentContainerStyle={styles.flatlist}
                    />
                )}
                
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isVisible}
                    onRequestClose={() => setIsVisible(false)}
                >
                    <View style={styles.modal_container}>
                        <View style={styles.modal_content}>
                            {ativoSelecionado && (
                                <>
                                    <Text style={styles.modal_titulo}>Quantas unidades de {ativoSelecionado?.ativo} deseja vender?</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={quantAtivo}
                                        onChangeText={(text) =>{
                                            const valorPositivo = text.replace(/[^0-9.]/g, '');
                                            setQuantAtivo(valorPositivo);
                                        }}
                                    />

                                    {modalError ? <Text style={styles.error}> {modalError} </Text> : null}

                                    <View style={styles.modal_buttons}>
                                        <TouchableOpacity
                                            style={styles.button_confirm}
                                            onPress={() => handleVenda()}
                                        >
                                            <Text style={styles.button_text}>Confirmar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.button_cancel}
                                            onPress={() => setIsVisible(false)}
                                        >
                                            <Text style={styles.button_text}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        )
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#000',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: 10
        },
        titulo_container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        titulo: {
            fontSize: 24,
            fontFamily: "Inter-Bold",
            marginRight: 10,
            color: "#fff",
            marginTop: 20,
        },
        subtitulo: {
            fontSize: 14,
            fontFamily: "Inter",
            marginBottom: 10,
            color: "#fff"
        },
        flatlist:{
            paddingBottom: 10
        },
        favorito_container: {
            backgroundColor: '#ffffb3',
            padding: 10,
            marginVertical: 5,
            borderRadius: 5,
            width: '100%',
            flexDirection: 'row',
            alignItems: "left",
            justifyContent: 'space-between',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        ativo_container: {
            backgroundColor: '#404040',
            padding: 10,
            marginVertical: 5,
            borderRadius: 5,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'left',
            justifyContent: 'space-between',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        ativo_nome_container: {
            flex: 1,
            marginLeft: 10,
        },
        ativo_nome: {
            fontSize: 18,
            fontFamily: "Inter-Bold",
            color: "#fff",
            flex: 1,
            textAlign: 'left',
        },
        ativo_tipo: {
            fontSize: 14,
            fontFamily: "Inter",
            color: "#c9c7c7",
            flex: 1,
            textAlign: 'left'
        },
        ativo_quantidade: {
            fontSize: 14,
            fontFamily: "Inter",
            color: "#fff",
            flex: 1,
            textAlign: 'left'
        },
        ativo_valor: {
            fontSize: 12,
            fontFamily: "Inter",
            color: "#fff",
            flex: 1,
            textAlign: 'left'
        },
        ativo_change_container: {
            flexDirection: 'column',
            alignItems: 'center',
        },
        ativo_change: {
            fontSize: 14,
            fontFamily: "Inter-Bold"
        },
        favorito_nome: {
            fontSize: 18,
            fontFamily: "Inter-Bold",
            color: "#000",
            flex: 1,
            textAlign: 'left'
        },
        favorito_tipo: {
            fontSize: 14,
            fontFamily: "Inter",
            color: "#262626",
            flex: 1,
            textAlign: 'left'
        },
        ativo_quantidade_container: {
            flexDirection: "column",
            alignItems: 'left',
            marginRight: 15
        },
        favorito_quantidade: {
            fontSize: 14,
            fontFamily: "Inter",
            color: "#000",
            flex: 1,
            textAlign: 'left'
        },
        favorito_valor: {
            fontSize: 12,
            fontFamily: "Inter",
            color: "#000",
            flex: 1,
            textAlign: 'right'
        },
        error: {
            color: "red",
            fontFamily: "Inter",
            fontSize: 20,
            marginVertical: 20
        },
        modal_container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        modal_content: {
            backgroundColor: 'white',
            paddingVertical: 20,
            paddingHorizontal: 15,
            borderRadius: 15,
            width: '85%',
            alignItems: 'center',
            elevation: 10,
        },
        modal_titulo: {
            fontSize: 18,
            color: "#000",
            fontFamily: "Inter",
            marginBottom: 10,
            textAlign: 'center',
        },
        input: {
            width: '100%',
            height: 45,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 20,
            paddingHorizontal: 10,
            fontSize: 16,
        },
        modal_buttons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 10,
        },
        button_confirm: {
            backgroundColor: '#50c770',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: "black",
            alignItems: 'center',
            width: '48%',
        },
        button_cancel: {
            backgroundColor: '#c75050',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: "black",
            alignItems: 'center',
            width: '48%',
        },
        button_text: {
            color: '#000',
            fontFamily: "Inter",
            fontSize: 16,
        },
    });