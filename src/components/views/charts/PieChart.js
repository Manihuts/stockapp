import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { PieChart } from "react-native-svg-charts";
import { G, Text as SvgText } from "react-native-svg";

const calculaPorcentagem = (value, total) => {
    return ((value / total) * 100).toFixed(1);
};

export const PieChartComponent = ({ data, title }) => {
    const totalValue = data.reduce((acc, item) => acc + item.value, 0);

    const chartData = data.map((item, index) => ({
        key: `pie-${index}`,
        value: item.value,
        svg: {
            fill: item.color
        },
        percentage: calculaPorcentagem(item.value, totalValue)
    }));

    const Labels = ({ slices }) => {
        return slices.map((slice, index) => {
            const { labelCentroid, pieCentroid, data } = slice;
            const percentage = data.percentage;

            return (
                <SvgText
                    key={index}
                    x={labelCentroid[0]}
                    y={labelCentroid[1]}
                    fill={'#000'}
                    textAnchor={'middle'}
                    alignmentBaseline={'middle'}
                    fontSize={18}
                    fontFamily="Inter"
                    stroke={'#000'}
                    strokeWidth={0.2}
                >
                    {percentage + '%'}
                </SvgText>
            );
        });
    };

    return (
        <SafeAreaView style={styles.chartContainer}>
            <Text style={styles.titulo}> {title} </Text>
            <PieChart
                style={styles.pieChart}
                data={chartData}
                innerRadius="50%"
                outerRadius="90%"
                padAngle={0.02}
            >
                <Labels />
            </PieChart>
            <View style={styles.legend}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View
                            style={[styles.legendColor, { backgroundColor: item.color }]}
                        />
                        <Text style={styles.legendText}>{item.label}</Text>
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    titulo: {
        fontFamily: "Inter-Bold",
        color: "#fff",
        fontSize: 24,
        marginBottom: 20
    },
    pieChart: {
        height: 300,
        width: 300,
    },
    legend: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "center",
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
    },
    legendColor: {
        width: 20,
        height: 20,
        marginRight: 5,
        borderRadius: 20
    },
    legendText: {
        fontFamily: "Inter",
        color: "#fff",
        fontSize: 14,
    },
});
