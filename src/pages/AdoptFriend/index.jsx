import { useState, useEffect } from 'react'
import { publicationsApi } from '../../axios/config.js';
import axios from 'axios'

import ConteinerAdoptFriend from './styles.js'
import Menu from "../../components/Menu";
import Footer from '../../components/Footer'
import MsgNoResults from '../../components/MsgNoResults/';
import CardPet from '../../components/CardPet/';
import Button from '../../components/Button'

import {GoArrowLeft as LeftArrow, GoArrowRight as RightArrow} from 'react-icons/go'

import {
    Box,
    Stack
} from '@chakra-ui/react';

const initialOptions = {

}

function AdoptFriend() {
    const [publications, setPublications] = useState([])
    const [options, setOptions] = useState(initialOptions)
    const [ufs, setUfs] = useState([])
    const [page, setPage] = useState(1)

    const handleOptions = (e) => {
        const { name, value } = e.target
        let newState = { ...options }
        newState[name] = value

        if (newState[name] == '') {
            // se algum filtro estiver vazio, remova a propriedade que controla seu valor para que não intefira na consulta a api
            delete newState[name]
        }

        setOptions(newState)
    }

    const handleSearch = async () => {
        // cria uma url com os parâmetros de acordo com os filtros selecionados
        const params = new URLSearchParams(options)

        const url = `/publications?${params.toString()}`

        await publicationsApi.get(url)
            .then(response => setPublications(response.data))
            .catch(err => console.log(err))
    }

    const getPublications = async () => {
        const url = `/publications?_page=${page}&_limit=16`
        await publicationsApi.get(url)
            .then(response => setPublications(response.data))
            .catch(err => console.log(err))
    }

    const getUfs = async () => {
        // pega todos os estados
        await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => setUfs(response.data))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getPublications()
        getUfs()
    }, [page])

    return (
        <>
            <Menu />

            <ConteinerAdoptFriend>
                <main>

                    <h2>Adote um amigo!</h2>
                    <div className='conteiner-filters' value={options.uf} onChange={handleOptions}>


                        <select name="specie" id="specie">
                            <option value="">Espécies</option>
                            <option value="Cachorro">Cachorro</option>
                            <option value="Gato">Gato</option>
                        </select>

                        <select name="sex" id="sex">
                            <option value="">Genêro</option>
                            <option value="Masculino">Macho</option>
                            <option value="Feminino">Fêmea</option>
                        </select>

                        <select name="sigleUf" id="sigleUf">
                            <option value="">Estado</option>
                            {ufs.map(uf => {
                                return (
                                    <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>
                                )
                            })}
                        </select>

                        <select name="size" id="size">
                            <option value="">Portes</option>
                            <option value="Pequeno">Pequeno</option>
                            <option value="Médio">Médio</option>
                            <option value="Grande">Grande</option>
                        </select>

                        <Button color='orange' content='Buscar' onClick={handleSearch} />
                    </div>

                    <div className="conteiner-publications">

                        {publications.length > 0 ? (
                            publications.map(publication => {
                                return <CardPet key={publication.id} publication={publication} />
                            })
                        ) : (
                            <MsgNoResults msg='Nenhum resultado encontrado!' />
                        )}

                    </div>
                </main>

                {/* navegação das páginas */}
                <Stack align='center' justify='center' display={Object.keys(options).length > 0 ? 'none' : 'flex'}>
                    {/* só vai aparecer se nenhuma opção de filtro estiver selecionada */}
                    <Box 
                    mt='30px' 
                    display='flex' 
                    gap='25px' 
                    fontSize='1.2rem' 
                    borderRadius='30px' 
                    bg='#ff992545' 
                    padding='10px'>
                        <LeftArrow size='25' cursor='pointer' onClick={() => page > 1 && setPage(prev => prev - 1)} />
                        {page}
                        <RightArrow size='25' cursor='pointer' onClick={() => page >= 1 && setPage(prev => prev + 1)} />
                    </Box>
                </Stack>

            </ConteinerAdoptFriend>

            <Footer />
        </>
    );
}

export default AdoptFriend;