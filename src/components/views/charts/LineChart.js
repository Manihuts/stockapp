import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import { Circle, Text as SvgText } from 'react-native-svg';

export const LineChartComponent = ({ data, title }) => {
    const saldos = data.map(item => item.saldo);
    const datas = data.map(item => {
        const date = new Date(item.data);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    });
    const indices = saldos.map((_, index) => index);

    const Dots = ({ x, y, data }) => (
        data.map((value, index) => (
            <React.Fragment key={index}>
                <Circle
                    cx={x(index)}
                    cy={y(value)}
                    r={3}
                    stroke={'#24f07d'}
                    fill={'#24f07d'}
                />
                
                <SvgText
                    x={x(index) - 2}
                    y={y(value) - 10}
                    fill={'#fff'}
                    fontSize={12}
                    fontFamily='Inter-Bold'
                    textAnchor="middle"
                >
                    {Number(value).toFixed(2)}
                </SvgText>
            </React.Fragment>
        ))
    );

    return (
        <SafeAreaView style={styles.chartContainer}>
            <Text style={styles.titulo}>{title}</Text>
            <View style={styles.chartContent}>
                <YAxis
                    data={saldos}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{
                        fill: 'white',
                        fontSize: 10
                    }}
                    numberOfTicks={5}
                    formatLabel={(value) => value}
                    style={styles.y_axis}
                />
                <View style={styles.chartWrapper}>
                    <LineChart
                        style={styles.lineChart}
                        data={saldos}
                        svg={{ stroke: '#24f07d', strokeWidth: 2 }}
                        contentInset={{ top: 20, bottom: 20, left: 15, right: 15 }}
                    >
                        <Grid svg={{ stroke: 'rgba(255, 255, 255, 0.3)' }} />
                        <Dots data={saldos} />
                    </LineChart>
                    
                    <XAxis
                        style={{ marginHorizontal: 5, marginBottom: 30 }}
                        data={indices}
                        formatLabel={(value, index) => datas[index]}
                        contentInset={{ left: 15, right: 15 }}
                        svg={{ fontSize: 10, fill: 'white' }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        padding: 5,
        borderRadius: 8,
    },
    chartContent: {
        flexDirection: 'row',
        backgroundColor: "#1A1A1A",
        borderRadius: 5,
        padding: 5,
        width: '100%',
        height: "70%",
    },
    y_axis: {
        marginRight: 5
    },
    chartWrapper: {
        flex: 1,
        height: 360,
         
    },
    titulo: {
        fontFamily: "Inter-Bold",
        color: "#fff",
        fontSize: 24,
        marginBottom: 20,
    },
    lineChart: {
        flex: 1,
    },
});
