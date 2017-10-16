import {ListaNegociacoes} from '../models/ListaNegociacoes';
import {Mensagem} from '../models/Mensagem';
import {Negociacao} from '../models/Negociacao';
import {MensagemView} from '../views/MensagemView';
import {NegociacoesView} from '../views/NegociacoesView';
import {NegociacaoService} from '../services/NegociacaoService';
import {DateHelper} from '../helpers/DateHelper';
import {Bind} from '../helpers/Bind';


class NegociacaoController{
    constructor(){
        let $ = document.querySelector.bind(document);
        this._inputData = $("#data");
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        this._ordemAtual = '';
        this._negociacaoService = new NegociacaoService()

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($("#negociacoesView")),
            'esvazia', 'adiciona', 'ordena', 'inverteOrdem'
            );

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($("#mensagemView")),
            'texto');
            
            this._init();
            
        }
        
        _init(){

            this._negociacaoService.lista()
                .then(negociacoes => 
                    negociacoes.forEach(negociacao => 
                        this._listaNegociacoes.adiciona(negociacao)
                    ))
                .catch(erro => this._mensagem.texto = erro);

                setInterval(() => {
                    this.importa();
                }, 3000);
    }

    ordena(campo){
        if(this._ordemAtual != campo)
            this._listaNegociacoes.ordena((a, b) => a[campo] - b[campo]);
        else
            this._listaNegociacoes.inverteOrdem();

        this._ordemAtual = campo;
    }
    
    adiciona(event){

        event.preventDefault();
        let negociacao = this._criaNegociacao();

        this._negociacaoService
            .cadastra(negociacao)
            .then(mensagem => {

                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = mensagem;
                this._limpaFormulario();    
            })
            .catch(erro => this._mensagem.texto = erro);
    }

    apaga(){

        this._negociacaoService
            .apagaTodos()
            .then(mensagem => {
                this._listaNegociacoes.esvazia();
                this._mensagem.texto = mensagem;
            })
            .catch(erro =>  this._mensagem.texto = erro);            
        
    }
    importa(){

        this._negociacaoService
            .importa(this._listaNegociacoes)
            .then(negociacoes => {
                negociacoes.map(negociacao => {
                    this._listaNegociacoes.adiciona(negociacao);
                    this._mensagem.texto = "Negociações importadas com sucesso!";
                })
            })
            .catch(erro => this._mensagem.texto = erro);

    }

    _criaNegociacao(){
       return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value);
            console.log(negociacao
        );
    }
    _limpaFormulario(){
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;

        this._inputData.focus();
        
    }
}

let negociacaoController = new NegociacaoController();

export function currentInstance() {
    return negociacaoController;
}