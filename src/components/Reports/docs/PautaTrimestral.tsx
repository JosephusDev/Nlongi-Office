import { Asset } from 'expo-asset'
const asset = Asset.fromModule(require('@/assets/images/insignia.png'))

const notas = [
	{ nome: 'João da Silva', mac: 15, pp: 12, pt: 14, mt: 13.7 },
	{ nome: 'Maria Fernandes', mac: 18, pp: 16, pt: 17, mt: 17.0 },
	{ nome: 'Carlos Oliveira', mac: 10, pp: 11, pt: 9, mt: 10.0 },
]

export const PautaTrimestral = `
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
            p {
                font-size: 15px; 
                font-family: Helvetica Neue; 
                font-weight: normal;
                margin: 10px 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 50px;
            }
            th, td {
                border: 1px solid gray;
                padding: 8px;
                text-align: center;
                font-family: Helvetica Neue;
                font-size: 14px;
            }
            th {
                font-weight: bold;
            }
            img {
                width: 5vw;
            }
        </style>
    </head>
    <body style="text-align: center;">
        <img
            src=${asset.localUri ?? asset.uri}
            alt="Insígnia"
        />    
        <p>REPÚBLICA DE ANGOLA</p>
        <p>MINISTÉRIO DA EDUCAÇÃO</p>

        <table>
            <thead>
                <tr>
                    <th>Nº</th>
                    <th>NOME COMPLETO</th>
                    <th>MAC</th>
                    <th>PP</th>
                    <th>PT</th>
                    <th>MT</th>
                </tr>
            </thead>
            <tbody>
                ${notas
									.map(
										(student, idx) => `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>${student.nome}</td>
                        <td>${student.mac}</td>
                        <td>${student.pp}</td>
                        <td>${student.pt}</td>
                        <td>${student.mt}</td>
                    </tr>
                `,
									)
									.join('')}
            </tbody>
        </table>
    </body>
</html>
`
