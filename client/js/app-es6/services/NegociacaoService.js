import {HttpService} from './HttpService';
import {ConnectionFactory} from './ConnectionFactory';
import {NegociacaoDao} from '../daos/NegociacaoDao';
import {Negociacao} from '../models/Negociacao';

export class NegociacaoService{

    constructor(){
        this._httpService = new HttpService();
    }

    obterNegociacoes(){
        return Promise.all([
                this.obterNegociacoesDaSemana(),
                this.obterNegociacoesDaSemanaAnterior(),
                this.obterNegociacoesDaSemanaRetrasada()
            ]).then(negociacoes =>{
                return negociacoes.reduce((arrayAnterior, array) =>
                 arrayAnterior.concat(array), [])
            }).catch(erro => {
                throw new Erro(erro)
            });
    }

    obterNegociacoesDaSemana(){

        return new Promise((resolve, reject) => {
            this._httpService.get("/negociacoes/semana")
                .then((objetos) => 
                    resolve(objetos.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))))
                .catch((erro) => {
                    console.log(erro);
                    reject("Não foi possível obter as negociações da semana!");   
                });
                        
        });
    }

    obterNegociacoesDaSemanaAnterior(){

        return new Promise((resolve, reject) => {
            this._httpService.get("/negociacoes/anterior")
                .then((objetos) => 
                    resolve(objetos.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))))
                .catch((erro) => {
                    console.log(erro);
                    reject("Não foi possível obter as negociações da semana anterior!");   
                });
        });
    }

    obterNegociacoesDaSemanaRetrasada(){
        return new Promise((resolve, reject) => {
            this._httpService.get("/negociacoes/retrasada")
                .then((objetos) => 
                    resolve(objetos.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))))
                .catch((erro) => {
                    console.log(erro);
                    reject("Não foi possível obter as negociações da semana retrasada!");   
                });
        });
    }

    cadastra(negociacao){
        return ConnectionFactory.getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => "Negociação adicionada com sucesso")
            .catch(() => "Não foi possível adicionar negociação");
    }
    lista(){
        return ConnectionFactory.getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.lista())
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível listar as negociações");
            });
    }
    apagaTodos(){
        return ConnectionFactory.getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível apagar as negociações");
            });
    }
    importa(listaAtual){

        return this.obterNegociacoes()
            .then(negociacoes =>
                    negociacoes.filter((negociacao) =>
                        !listaAtual.negociacoes.some((existente) => 
                            existente.isEquals(negociacao))
                ))
            .catch(erro => {
                console.log(erro);
                throw new Error("não foi possível importar negociações");
            });
    }
}