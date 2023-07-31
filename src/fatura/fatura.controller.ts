
import { Controller, Get, Post, UploadedFiles, UseInterceptors, HttpCode } from '@nestjs/common';
import { FaturaService } from './fatura.service';
import { Fatura } from './fatura.entity';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
const pdfjsLib = require('pdfjs-dist/build/pdf');
import { diskStorage } from 'multer';



@Controller('faturas')
export class FaturaController {
  constructor(private faturaService: FaturaService) {}

  @Get()
  async findAll(): Promise<Fatura[]> {
    return this.faturaService.findAll();
  }

  @Post('/upload')
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(200)
  async uploadFiles(@UploadedFiles() pdfFiles: Express.Multer.File[]): Promise<{message: string}> {
    // const storagePath = path.resolve(process.cwd(), 'uploads');
    // console.log(storagePath);
    // if (!fs.existsSync(storagePath)) {
    //   fs.mkdirSync(storagePath, { recursive: true });
    // }
    // const uploadedFilesPaths = [];
    // for (const pdfFile of pdfFiles) {
    //   const uniqueFileName = `${pdfFile.originalname}`;
    //   const filePath = path.join(storagePath, uniqueFileName);
    //   fs.writeFileSync(filePath, pdfFile.buffer);
    //   uploadedFilesPaths.push(filePath);
    // }
    await this.lerPDF()
    return { message: 'Success' };
  }
  
  async lerPDF(): Promise<any> {
    const pdfCaminhos = this.listFiles('./uploads');

    const dadosCliente = []; // Array para armazenar a linha onde consta o texto "No DO CLIENTE" e a próxima linha
    const mesAnoPattern = /(?:JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\/\d{4}/g; // Expressão regular para procurar o padrão XXX/XXXX (Ex: JUN/2023)
    const mmddyyyyPattern = /\d{2}\/\d{2}\/\d{4}/; // Expressão regular para procurar o padrão mm/dd/yyyy (Ex: 20/06/203)
    const mesDeReferencia = []; // Array para armazenar as ocorrências de XXX/XXXX
    const vencimento = []; // Array para armazenar as ocorrências de mm/dd/yyyy
    const valorEnergiaEletrica = []; // Array para armazenar as ocorrências de "Energia Elétrica"
    const valorEnergiaHFP = []; // Array para armazenar as ocorrências de "Energia injetada HFP"
    const valorEnergiaCompSemICMS = []; // Array para armazenar as ocorrências de "Energia SCEE s/ ICMS"
    const valorEnergiaPublica = []; // Array para armazenar as ocorrências de "Energia SCEE s/ ICMS"
    const valorEnergiaTotal = []; // Array para armazenar as ocorrências de "Total"

    for (const pdfCaminho of pdfCaminhos) {
      if (fs.existsSync(pdfCaminho)) {
        try {
          
          // Carregar o PDF usando pdfjs-dist
          const pdfData = new Uint8Array(fs.readFileSync(pdfCaminho));

          // Inicializar o PDFJS
          const pdf = await pdfjsLib.getDocument(pdfData).promise;

          const numPages = pdf.numPages;
          let clientLineNumber = null; // Variável para armazenar o número da linha onde consta o texto "No DO CLIENTE"

          // Extrair todo o texto do PDF
          let pdfText = '';
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            pdfText += pageText + '\n'; // Adicionar quebra de linha após cada página

            // Procurar pelo texto "No DO CLIENTE" no conteúdo da página
            for (let line = 0; line < textContent.items.length; line++) {
              const item = textContent.items[line];
              if (item.str.includes('CLIENTE')) {
                clientLineNumber = line + 1; // Incrementar 1 para obter o número da linha real (índices de linha começam em 0)

                // Obter a próxima linha (linha subsequente)
                const nextLine = textContent.items[line + 1]?.str || '';
                const uc =  nextLine.match(/\d+/)[0];

                // console.log(`Texto encontrado no arquivo ${pdfCaminho}, na linha ${clientLineNumber}:`, item.str);
                // console.log(`Linha subsequente:`, uc);

                dadosCliente.push({ filename: pdfCaminho, uc });
                break; // Não precisa continuar procurando em outras páginas
              }
            }

            // Procurar pelas ocorrências de XXX/XXXX no conteúdo completo do PDF
            const mesAnoMatches = pageText.match(mesAnoPattern);

            if (mesAnoMatches) {
              // console.log(`Meses/Anos encontrados no arquivo ${pdfCaminho}:`, mesAnoMatches);
              mesDeReferencia.push({ filename: pdfCaminho, occurrences: mesAnoMatches });
            }

            // Procurar pelo primeiro registro de mm/dd/yyyy no conteúdo completo do PDF
            const mmddyyyyMatch = pageText.match(mmddyyyyPattern);

            if (mmddyyyyMatch) {
              // console.log(`Primeira data no formato mm/dd/yyyy encontrada no arquivo ${pdfCaminho}:`, mmddyyyyMatch[0]);
              vencimento.push({ filename: pdfCaminho, occurrences: [mmddyyyyMatch[0]] });
            }
          }

          // Procurar pela linha que contém "Energia Elétrica"
          const lines = pdfText.split('\n');
          let energiaEletricaLine = null;

          for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            if (line.includes('Energia Elétrica')) {
              energiaEletricaLine = line;
              break;
            }
          }
          
          // Listar as palavras na linha encontrada
          if (energiaEletricaLine) {
            const words = energiaEletricaLine.trim().split(/\s+/);
            const index = words.indexOf('Energia');
            const wordsAfterEnergiaEletrica = words.slice(index + 1, index + 6);
            // console.log(`Linha com "Energia Elétrica" no arquivo ${pdfCaminho}:`, energiaEletricaLine);
            // console.log('Próximas quatro palavras:', wordsAfterEnergiaEletrica);
            valorEnergiaEletrica.push({ filename: pdfCaminho, occurrences: wordsAfterEnergiaEletrica });
          }

          // Nova Procura
          // Procurar pela linha que contém "Energia Elétrica"
          const lines2 = pdfText.split('\n');
          let energiaHfpLine = null;

          for (let lineIndex = 0; lineIndex < lines2.length; lineIndex++) {
            const line2 = lines2[lineIndex];
            if (line2.includes('Energia injetada HFP')) {
              energiaHfpLine = line2;
              break;
            }
          }

          // Listar as palavras na linha encontrada
          if (energiaHfpLine) {
            const words = energiaHfpLine.trim().split(/\s+/);
            const index = words.indexOf('HFP');
            const wordsAfterEnergiaHfp = words.slice(index + 1, index + 5);
            // console.log(`Linha com "Energia Elétrica" no arquivo ${pdfCaminho}:`, energiaHfpLine);
            // console.log('Próximas quatro palavras:', wordsAfterEnergiaHfp);
            // valorEnergiaHFP.push({ filename: pdfCaminho, occurrences: wordsAfterEnergiaHfp });
            valorEnergiaHFP.push({ filename: pdfCaminho, occurrences: wordsAfterEnergiaHfp });
          }else{
            valorEnergiaHFP.push({ filename: pdfCaminho, occurrences: '00000' });
          }

           // Nova Procura
          // Procurar pela linha que contém "Energia Elétrica"
          const lines3 = pdfText.split('\n');
          let energiaIcmsLine = null;

          for (let lineIndex = 0; lineIndex < lines3.length; lineIndex++) {
            const line3 = lines3[lineIndex];
            if (line3.includes('En comp. s/ ICMS')) {
              energiaIcmsLine = line3;
              break;
            }
          }

          // Listar as palavras na linha encontrada
          if (energiaIcmsLine) {
            const words = energiaIcmsLine.trim().split(/\s+/);
            const index = words.indexOf('s/');
            const wordsAfterEnergiaIcms = words.slice(index + 1, index + 6);
            // console.log(`Linha com "Energia Elétrica" no arquivo ${pdfCaminho}:`, energiaIcmsLine);
            // console.log('Próximas quatro palavras:', wordsAfterEnergiaIcms);
            valorEnergiaCompSemICMS.push({ filename: pdfCaminho, occurrences: wordsAfterEnergiaIcms });
          }else{
            valorEnergiaCompSemICMS.push({ filename: pdfCaminho, occurrences: '00000' });
          }

          // Nova Procura
          // Procurar pela linha que contém "Energia Elétrica"
          const lines4 = pdfText.split('\n');
          let energiaPublicaLine = null;

          for (let lineIndex = 0; lineIndex < lines4.length; lineIndex++) {
            const line4 = lines4[lineIndex];
            if (line4.includes('Contrib Ilum Publica Municipal')) {
              energiaPublicaLine = line4;
              break;
            }
          }

          // Listar as palavras na linha encontrada
          if (energiaPublicaLine) {
            const words = energiaPublicaLine.trim().split(/\s+/);
            const index = words.indexOf('Municipal');
            const wordsAfterEnergiaPublica = words.slice(index + 1, index + 2);
            // console.log(`Linha com "Energia Elétrica" no arquivo ${pdfCaminho}:`, energiaPublicaLine);
            // console.log('Próximas quatro palavras:', wordsAfterEnergiaPublica);
            valorEnergiaPublica.push({ filename: pdfCaminho, occurrences: wordsAfterEnergiaPublica });
          }

          // Nova Procura
          // Procurar pela linha que contém "Energia Elétrica"
          const lines5 = pdfText.split('\n');
          let energiaTotalLine = null;

          for (let lineIndex = 0; lineIndex < lines5.length; lineIndex++) {
            const line5 = lines5[lineIndex];
            if (line5.includes('TOTAL')) {
              energiaTotalLine = line5;
              break;
            }
          }

          // Listar as palavras na linha encontrada
          if (energiaTotalLine) {
            const words = energiaTotalLine.trim().split(/\s+/);
            const index = words.indexOf('TOTAL');
            const wordsAfterEnergiaTotal = words.slice(index + 1, index + 2);
            // console.log(`Linha com "Energia Elétrica" no arquivo ${pdfCaminho}:`, energiaTotalLine);
            // console.log('Próximas quatro palavras:', wordsAfterEnergiaTotal);
            valorEnergiaTotal.push({ filename: pdfCaminho, occurrences: wordsAfterEnergiaTotal });
          }

        } catch (error) {
          console.error(`Erro ao ler o arquivo ${pdfCaminho}:`, error);
          dadosCliente.push({ filename: pdfCaminho, error: 'Erro ao ler o PDF' });
        }
      } else {
        console.log('Arquivo PDF não localizado:', pdfCaminho);
        dadosCliente.push({ filename: pdfCaminho, message: 'Arquivo PDF não encontrado' });
      }
    }




    // Criar um objeto vazio para armazenar os resultados agrupados por filename
  const aggregatedResults: { [filename: string]: any } = {};

  // Função auxiliar para adicionar ou atualizar o resultado agrupado
  const addOrUpdateResult = (filename: string, key: string, data: any) => {
    if (!aggregatedResults[filename]) {
      aggregatedResults[filename] = {};
    }
    aggregatedResults[filename][key] = data;
  };

  // Agrupar resultados por "filename" para dadosCliente
  for (const result of dadosCliente) {
    addOrUpdateResult(result.filename, 'dadosCliente', result);
  }

  // Agrupar resultados por "filename" para mesDeReferencia
  for (const result of mesDeReferencia) {
    addOrUpdateResult(result.filename, 'mesDeReferencia', result.occurrences[0]);
  }

  // Agrupar resultados por "filename" para vencimento
  for (const result of vencimento) {
    addOrUpdateResult(result.filename, 'vencimento', result.occurrences[0]);
  }

  // Agrupar resultados por "filename" para valorEnergiaEletrica
  for (const result of valorEnergiaEletrica) {
    addOrUpdateResult(result.filename, 'valorEnergiaEletrica', result.occurrences[4]);
  }

  for (const result of valorEnergiaEletrica) {
    addOrUpdateResult(result.filename, 'quantidadeEnergiaEletrica', result.occurrences[2]);
  }

  for (const result of valorEnergiaEletrica) {
    addOrUpdateResult(result.filename, 'precoUnitEnergiaEletrica', result.occurrences[3]);
  }

  // Agrupar resultados por "filename" para valorEnergiaHFP
  for (const result of valorEnergiaHFP) {
    addOrUpdateResult(result.filename, 'valorEnergiaHFP', result.occurrences[3]);
  }

  for (const result of valorEnergiaHFP) {
    addOrUpdateResult(result.filename, 'quantidadeEnergiaHFP', result.occurrences[1]);
  }

  for (const result of valorEnergiaHFP) {
    addOrUpdateResult(result.filename, 'precoUnitEnergiaHFP', result.occurrences[2]);
  }

  // Agrupar resultados por "filename" para valorEnergiaCompSemICMS
  for (const result of valorEnergiaCompSemICMS) {
    addOrUpdateResult(result.filename, 'valorEnergiaCompSemICMS', result.occurrences[4]);
  }

  for (const result of valorEnergiaCompSemICMS) {
    addOrUpdateResult(result.filename, 'quantidadeEnergiaCompSemICMS', result.occurrences[2]);
  }

  for (const result of valorEnergiaCompSemICMS) {
    addOrUpdateResult(result.filename, 'precoUnitEnergiaCompSemICMS', result.occurrences[3]);
  }

  // Agrupar resultados por "filename" para valorEnergiaPublica
  for (const result of valorEnergiaPublica) {
    addOrUpdateResult(result.filename, 'valorEnergiaPublica', result.occurrences[0]);
  }

  // Agrupar resultados por "filename" para valorEnergiaTotal
  for (const result of valorEnergiaTotal) {
    addOrUpdateResult(result.filename, 'valorEnergiaTotal', result.occurrences[0]);
  }

  // Converter o objeto agregado em um array de resultados
  const aggregatedResultsArray = Object.keys(aggregatedResults).map((filename) => {
    return { filename, ...aggregatedResults[filename] };
  });


  for (const resultItem of aggregatedResultsArray) {
    const fatura = new Fatura();
    fatura.uccliente = resultItem.dadosCliente['uc'];
    fatura.mesfatura = resultItem.mesDeReferencia;
    fatura.datavencimentofatura = resultItem.vencimento;
    fatura.valorenergiaeletricafatura = resultItem.valorEnergiaEletrica.replace(/,/g, '');
    fatura.qtdkwhenergiaeletricafatura = resultItem.quantidadeEnergiaEletrica.replace(/\./g, '');
    fatura.precounitenergiaeletricafatura = resultItem.precoUnitEnergiaEletrica.replace(/,/g, '');
    fatura.valorenergiainjetadafatura = resultItem.valorEnergiaHFP.replace(/,/g, '');
    fatura.qtdkwhenergiainjetadafatura = resultItem.quantidadeEnergiaHFP.replace(/\./g, '');
    fatura.precounitenergiainjetadafatura = resultItem.precoUnitEnergiaHFP.replace(/,/g, '');
    fatura.valorenergiacompensadafatura = resultItem.valorEnergiaCompSemICMS.replace(/,/g, '');
    fatura.qtdkwhenergiacompensadafatura = resultItem.quantidadeEnergiaCompSemICMS.replace(/\./g, '');
    fatura.precounitenergiacompensadafatura = resultItem.precoUnitEnergiaCompSemICMS.replace(/,/g, '');
    fatura.valoriluminacaopublicafatura = resultItem.valorEnergiaPublica.replace(/,/g, '');
    fatura.valortotalfatura = resultItem.valorEnergiaTotal.replace(/,/g, '');

    // // Salvar a instância da entidade no banco de dados
    await this.faturaService.create(fatura);

  }


  return aggregatedResultsArray;

  }

  private listFiles(dir: string): string[] {
    const files = fs.readdirSync(dir);

    const filePaths = files.map(file => {
      return `${dir}/${file}`;
    });

    return filePaths;
  }

}
