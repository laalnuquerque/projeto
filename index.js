const {ApolloServer, gql} = require ('apollo-server')

const usuarios = [{
    id: 1,
    nome: 'Lucas de Abreu',
    email: 'lucasabreu@gmail.com',
    idade: 29
}, {
    id: 2,
    nome: 'Lucia Lima',
    email: 'lucia.lima@gmail.com',
    idade: 42
}, {
    id: 3,
    nome: 'Maria Silva',
    email: 'ms@gmail.com',
    idade: 18
}]

const typeDefs = gql`
    scalar Date

    type Produto {
        nome: String!
        preco: Float!
        desconto: Float
        precoComDesconto: Float
    }

    type Usuario {
        id: ID!
        nome: String!
        email: String!
        idade: Int
        salario: Float
        vip: Boolean    
    }

    # Pontos de entrada da API
    type Query {
        ola: String
        horaAtual: Date
        usuarioLogado: Usuario
        produtoEmDestaque: Produto
        numerosMegaSena: [Int!]!
        usuarios: [Usuario]
        usuario(id: ID): Usuario
    }
`

const resolvers = {
    Produto: {
        precoComDesconto(produto) {
            if(produto.desconto) {
                return produto.preco * (1 - produto.desconto)
            } else {
                return produto.preco
            }

        }
    },

    Usuario: {
        salario(usuario) {
            return usuario.salario_real
        }

    },

    Query: {
        ola() {
            return 'Bom Dia'
        },
        horaAtual() {
            return new Date
        },
        usuarioLogado() {
            return {
                id: 1,
                nome: 'Ana del rey',
                email: 'anadelrey@gmail.com',
                idade: 23,
                salario_real: 1234.56,
                vip: true
            }
        },
        produtoEmDestaque() {
            return {
                nome: 'pera',
                preco: 5.50,
                desconto: 0.15

            }
        },
        numerosMegaSena() {
            const crescente = (a, b) => a - b
            return Array(6).fill(0)
                .map(n => parseInt(Math.random() * 60 + 1))
                .sort(crescente)
        },
        usuarios() {
            return usuarios
        },
        usuario(_, args){
            const selecionados = usuarios.filter(u => u.id ==  args.id)
            return selecionados ? selecionados[0] : null
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
    console.log(`Executando em  ${url}`)
})