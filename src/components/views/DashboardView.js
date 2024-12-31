import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Icon, SegmentedButtons, Text } from "react-native-paper";
import { LogadoContext } from "../../context/LogadoContext.js";
import { buscaComposicaoCarteira, buscaEvolucaoSaldo, buscaEvolucaoValorInvestido } from "../../services/ativoService.js";
import { PieChartComponent } from "./charts/PieChart.js";
import { useFocusEffect } from "@react-navigation/native";
import { LineChartComponent } from "./charts/LineChart.js";

// Página com dashboard informativa
export default DashboardView = () => {
    const { userId, token } = useContext(LogadoContext);

    const [chartSelecionado, setChartSelecionado] = useState("composicao");
    const [dados, setDados] = useState([]);
    const [error, setError] = useState(null);

    useFocusEffect(
        useCallback(() => {
            const getDados = async () => {
                setError("");

                try {
                    let dadosApi;
                    switch (chartSelecionado) {
                        case "composicao":
                            dadosApi = await buscaComposicaoCarteira(userId, token);
                            break;
                        case "evolucao_saldo":
                            dadosApi = await buscaEvolucaoSaldo(userId, token);
                            console.log(dadosApi);
                            break;
                        case "evolucao_valor":
                            dadosApi = await buscaEvolucaoValorInvestido(userId, token);
                            console.log(dadosApi);
                            
                            break;
                        default:
                            dadosApi = await buscaComposicaoCarteira(userId, token);
                            break;
                    };
    
                    if (dadosApi) {
                        setDados(dadosApi);
                    }
                } catch (error) {
                    setError(error.message);
                }
            };
    
            if (chartSelecionado) {
                getDados();
            };
        },[chartSelecionado])
    );

    const renderChart = () => {
        switch (chartSelecionado) {
            case "composicao":
                return dados.length > 0 ? <PieChartComponent data={dados} title={"Composição da Carteira"} /> : <ActivityIndicator size="large" color="#fff" />;
            case "evolucao_saldo":
                return dados.length > 0 ? <LineChartComponent data={dados} title={"Evolução do Saldo"} /> : <ActivityIndicator size="large" color="#fff" />;
            case "evolucao_valor":
                return dados.length > 0 ? <LineChartComponent data={dados} title={"Evolução do Valor Investido"} /> : <ActivityIndicator size="large" color="#fff" />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.icones_container}>
                <SegmentedButtons
                    value={chartSelecionado}
                    onValueChange={setChartSelecionado}
                    style={styles.segmented_buttons}
                    buttons={[
                        {
                            value: "composicao",
                            icon: () => <Icon source="chart-arc" size={35} color="#000" />,
                            label: "",
                            style: chartSelecionado === "composicao" ? styles.focusedButton : styles.defaultButton
                        },
                        {
                            value: "evolucao_saldo",
                            icon: () => <Icon source="chart-timeline-variant" size={35} color="#000" />,
                            label: "",
                            style: chartSelecionado === "evolucao_saldo" ? styles.focusedButton : styles.defaultButton,
                        },
                        {
                            value: "evolucao_valor",
                            icon: () => <Icon source="chart-timeline-variant-shimmer" size={35} color="#000" />,
                            label: "",
                            style: chartSelecionado === "evolucao_valor" ? styles.focusedButton : styles.defaultButton
                        },
                    ]}
                />
            </View>

            <View style={styles.chart_container}>
                {renderChart()}
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    icones_container: {
        flex: 1,
        alignItems: "center",
        marginTop: 40,
        marginBottom: 20,
        width: '100%',
    },
    segmented_buttons: {
        width: '90%',
    },
    chart_container: { 
        flex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    focusedButton: {
        backgroundColor: '#24f07d',
    },
    defaultButton: {
        backgroundColor: '#0d542c',
    },
    error: {
        color: "red",
        fontFamily: "Inter",
        fontSize: 18,
        marginVertical: 20
    },
});