import {
  Document,
  Image,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import type { CnpjData } from "../services/cnpj.service";

const styles = StyleSheet.create({
  page: {
    padding: 12,
    fontSize: 8,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  mainBorder: {
    border: "1pt solid #1a1a1a",
    padding: 8,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
    paddingBottom: 2,
  },
  brasao: {
    width: 42,
    height: 42,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 11.5,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#1a1a1a",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#1a1a1a",
    letterSpacing: 0.2,
  },
  spacer: {
    width: 42,
    marginLeft: 8,
  },
  firstRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  cnpjBox: {
    width: "24%",
    border: "0.75pt solid #2a2a2a",
    padding: 5,
    backgroundColor: "#fafafa",
  },
  documentTitleBox: {
    width: "52%",
    border: "0.75pt solid #2a2a2a",
    borderLeft: "none",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  dataAberturaBox: {
    width: "24%",
    border: "0.75pt solid #2a2a2a",
    borderLeft: "none",
    padding: 5,
    backgroundColor: "#fafafa",
  },
  label: {
    fontSize: 6.5,
    marginBottom: 2,
    color: "#4a4a4a",
    fontWeight: "bold",
    letterSpacing: 0.1,
  },
  value: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#000000",
    lineHeight: 1.2,
  },
  documentTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1a1a1a",
    letterSpacing: 0.2,
    lineHeight: 1.3,
  },
  fullWidthBox: {
    border: "0.75pt solid #2a2a2a",
    padding: 5,
    marginBottom: 2,
    width: "100%",
  },
  twoColumnRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  leftColumn: {
    width: "88%",
    border: "0.75pt solid #2a2a2a",
    padding: 5,
  },
  rightColumn: {
    width: "12%",
    border: "0.75pt solid #2a2a2a",
    borderLeft: "none",
    padding: 5,
  },
  threeColumnRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  col50: {
    width: "50%",
    border: "0.75pt solid #2a2a2a",
    padding: 5,
  },
  col14: {
    width: "14%",
    border: "0.75pt solid #2a2a2a",
    borderLeft: "none",
    padding: 5,
  },
  col36: {
    width: "36%",
    border: "0.75pt solid #2a2a2a",
    borderLeft: "none",
    padding: 5,
  },
  fourColumnRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  col18: {
    width: "18%",
    border: "0.75pt solid #2a2a2a",
    padding: 5,
  },
  col30: {
    width: "30%",
    border: "0.75pt solid #2a2a2a",
    borderLeft: "none",
    padding: 5,
  },
  col38: {
    width: "38%",
    border: "0.75pt solid #2a2a2a",
    borderLeft: "none",
    padding: 5,
  },
  col50Right: {
    width: "50%",
    border: "0.75pt solid #2a2a2a",
    borderLeft: "none",
    padding: 5,
  },
  col75: {
    width: "75%",
    border: "0.75pt solid #2a2a2a",
    padding: 5,
  },
  col25: {
    width: "25%",
    border: "0.75pt solid #2a2a2a",
    borderLeft: "none",
    padding: 5,
  },
  col31: {
    width: "31%",
    border: "0.75pt solid #2a2a2a",
    padding: 5,
  },
  activityItem: {
    fontSize: 8.5,
    fontWeight: "bold",
    marginBottom: 1.5,
    color: "#000000",
    lineHeight: 1.2,
  },
  footerContainer: {
    marginTop: 3,
    borderTop: "0.5pt solid #e0e0e0",
    paddingTop: 3,
    alignItems: "center",
  },
  approvalRow: {
    marginBottom: 2,
    width: "100%",
    alignItems: "center",
  },
  approvalText: {
    fontSize: 6.5,
    color: "#1a1a1a",
    lineHeight: 1.1,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomRow: {
    width: "100%",
    alignItems: "center",
  },
  emissionRow: {
    marginBottom: 2,
    alignItems: "center",
  },
  footerText: {
    fontSize: 6.5,
    color: "#444444",
    marginBottom: 0.5,
    textAlign: "center",
  },
  qrCodeRow: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 2,
  },
  qrCode: {
    width: 38,
    height: 38,
    marginBottom: 1,
  },
  authBox: {
    alignItems: "center",
  },
  authText: {
    fontSize: 5,
    color: "#333333",
    lineHeight: 1.1,
    textAlign: "center",
  },
  authLink: {
    fontSize: 5,
    color: "#0066cc",
    fontWeight: "bold",
    marginTop: 0.5,
    textAlign: "center",
  },
});

interface CartaoCNPJProps {
  data: CnpjData;
  emitidoEm?: Date;
  documentId: string;
  qrCodeDataUrl: string;
}

function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, "");
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
}

function formatDate(date: string): string {
  if (!date) return "";
  const cleaned = date.replace(/\D/g, "");
  if (cleaned.length === 8) {
    return `${cleaned.slice(6, 8)}/${cleaned.slice(4, 6)}/${cleaned.slice(0, 4)}`;
  }
  return date;
}

function formatCEP(cep: string): string {
  if (!cep) return "";
  const cleaned = cep.replace(/\D/g, "");
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
  }
  return cep;
}

function isMatriz(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, "");
  return cleaned.slice(8, 12) === "0001";
}

export function CartaoCNPJ({
  data,
  emitidoEm = new Date(),
  documentId,
  qrCodeDataUrl,
}: CartaoCNPJProps) {
  const cnpjFormatado = formatCNPJ(data.cnpj);
  const dataEmissao = emitidoEm.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const horaEmissao = emitidoEm.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainBorder}>
          <View style={styles.headerContainer}>
            <Svg viewBox="0 0 512 512" style={styles.brasao}>
              <Path
                fill="#009B3A"
                d="M256 0c141.38 0 256 114.62 256 256S397.38 512 256 512 0 397.38 0 256 114.62 0 256 0z"
              />
              <Path fill="#FEDF00" d="M256 92 462 256 256 420 50 256z" />
              <Path
                fill="#002776"
                d="M256 174c45.8 0 83 37.2 83 83s-37.2 83-83 83-83-37.2-83-83 37.2-83 83-83z"
              />
              <Path
                fill="#fff"
                d="M179 224c9-1 19-2 29-2 49 0 94 18 129 47-1 4-2 9-3 13-33-30-78-48-126-48-11 0-22 1-33 3 1-4 3-9 4-13z"
              />
            </Svg>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>
                REPÚBLICA FEDERATIVA DO BRASIL
              </Text>
              <Text style={styles.headerSubtitle}>
                CADASTRO NACIONAL DA PESSOA JURÍDICA
              </Text>
            </View>
            <View style={styles.spacer} />
          </View>

          <View style={styles.firstRow}>
            <View style={styles.cnpjBox}>
              <Text style={styles.label}>NÚMERO DE INSCRIÇÃO</Text>
              <Text style={styles.value}>{cnpjFormatado}</Text>
              <Text style={styles.value}>
                {isMatriz(data.cnpj) ? "MATRIZ" : "FILIAL"}
              </Text>
            </View>
            <View style={styles.documentTitleBox}>
              <Text style={styles.documentTitle}>
                COMPROVANTE DE INSCRIÇÃO E DE SITUAÇÃO CADASTRAL
              </Text>
            </View>
            <View style={styles.dataAberturaBox}>
              <Text style={styles.label}>DATA DE ABERTURA</Text>
              <Text style={styles.value}>{formatDate(data.dataAbertura)}</Text>
            </View>
          </View>

          <View style={styles.fullWidthBox}>
            <Text style={styles.label}>NOME EMPRESARIAL</Text>
            <Text style={styles.value}>{data.razaoSocial}</Text>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.leftColumn}>
              <Text style={styles.label}>
                TÍTULO DO ESTABELECIMENTO (NOME DE FANTASIA)
              </Text>
              <Text style={styles.value}>{data.nomeFantasia || "***"}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.label}>PORTE</Text>
              <Text style={styles.value}>{data.porte}</Text>
            </View>
          </View>

          <View style={styles.fullWidthBox}>
            <Text style={styles.label}>
              CÓDIGO E DESCRIÇÃO DA ATIVIDADE ECONÔMICA PRINCIPAL
            </Text>
            <Text style={styles.value}>
              {data.atividadePrincipal.codigo} -{" "}
              {data.atividadePrincipal.descricao}
            </Text>
          </View>

          {data.atividadesSecundarias &&
            data.atividadesSecundarias.length > 0 && (
              <View style={styles.fullWidthBox}>
                <Text style={styles.label}>
                  CÓDIGO E DESCRIÇÃO DAS ATIVIDADES ECONÔMICAS SECUNDÁRIAS
                </Text>
                {data.atividadesSecundarias.map((atividade, index) => (
                  <Text
                    key={`${atividade.codigo}-${index}`}
                    style={styles.activityItem}
                  >
                    {atividade.codigo} - {atividade.descricao}
                  </Text>
                ))}
              </View>
            )}

          <View style={styles.fullWidthBox}>
            <Text style={styles.label}>
              CÓDIGO E DESCRIÇÃO DA NATUREZA JURÍDICA
            </Text>
            <Text style={styles.value}>{data.naturezaJuridica}</Text>
          </View>

          <View style={styles.threeColumnRow}>
            <View style={styles.col50}>
              <Text style={styles.label}>LOGRADOURO</Text>
              <Text style={styles.value}>{data.logradouro}</Text>
            </View>
            <View style={styles.col14}>
              <Text style={styles.label}>NÚMERO</Text>
              <Text style={styles.value}>{data.numero}</Text>
            </View>
            <View style={styles.col36}>
              <Text style={styles.label}>COMPLEMENTO</Text>
              <Text style={styles.value}>{data.complemento || "***"}</Text>
            </View>
          </View>

          <View style={styles.fourColumnRow}>
            <View style={styles.col18}>
              <Text style={styles.label}>CEP</Text>
              <Text style={styles.value}>{formatCEP(data.cep)}</Text>
            </View>
            <View style={styles.col30}>
              <Text style={styles.label}>BAIRRO/DISTRITO</Text>
              <Text style={styles.value}>{data.bairro}</Text>
            </View>
            <View style={styles.col38}>
              <Text style={styles.label}>MUNICÍPIO</Text>
              <Text style={styles.value}>{data.municipio}</Text>
            </View>
            <View style={styles.col14}>
              <Text style={styles.label}>UF</Text>
              <Text style={styles.value}>{data.uf}</Text>
            </View>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.col50}>
              <Text style={styles.label}>ENDEREÇO ELETRÔNICO</Text>
              <Text style={styles.value}>{data.email || "***"}</Text>
            </View>
            <View style={styles.col50Right}>
              <Text style={styles.label}>TELEFONE</Text>
              <Text style={styles.value}>{data.telefone || "***"}</Text>
            </View>
          </View>

          <View style={styles.fullWidthBox}>
            <Text style={styles.label}>ENTE FEDERATIVO RESPONSÁVEL (EFR)</Text>
            <Text style={styles.value}>{data.efr || "*****"}</Text>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.col75}>
              <Text style={styles.label}>SITUAÇÃO CADASTRAL</Text>
              <Text style={styles.value}>{data.situacaoCadastral}</Text>
            </View>
            <View style={styles.col25}>
              <Text style={styles.label}>DATA DA SITUAÇÃO CADASTRAL</Text>
              <Text style={styles.value}>
                {formatDate(data.dataSituacaoCadastral)}
              </Text>
            </View>
          </View>

          <View style={styles.fullWidthBox}>
            <Text style={styles.label}>MOTIVO DE SITUAÇÃO CADASTRAL</Text>
            <Text style={styles.value}>
              {data.motivoSituacaoCadastral || "***"}
            </Text>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.col75}>
              <Text style={styles.label}>SITUAÇÃO ESPECIAL</Text>
              <Text style={styles.value}>
                {data.situacaoEspecial || "********"}
              </Text>
            </View>
            <View style={styles.col25}>
              <Text style={styles.label}>DATA DA SITUAÇÃO ESPECIAL</Text>
              <Text style={styles.value}>
                {data.dataSituacaoEspecial
                  ? formatDate(data.dataSituacaoEspecial)
                  : "********"}
              </Text>
            </View>
          </View>

          {data.qsa && data.qsa.length > 0 && (
            <View style={styles.fullWidthBox}>
              <Text style={styles.label}>
                QUADRO DE SÓCIOS E ADMINISTRADORES (QSA)
              </Text>
              {data.qsa.map((socio) => (
                <Text key={socio.nome} style={styles.activityItem}>
                  {socio.nome} - {socio.qualificacao}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.approvalRow}>
            <Text style={styles.approvalText}>
              Aprovado pela Instrução Normativa RFB nº 2.119, de 06 de dezembro
              de 2022.
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.emissionRow}>
              <Text style={styles.footerText}>
                Emitido no dia {dataEmissao} às {horaEmissao} (data e hora de
                Brasília).
              </Text>
              <Text style={styles.footerText}>Página: 1/1</Text>
            </View>

            <View style={styles.qrCodeRow}>
              <Image src={qrCodeDataUrl} style={styles.qrCode} />
              <View style={styles.authBox}>
                <Text style={styles.authText}>
                  Autenticidade digital verificada.
                </Text>
                <Text style={styles.authText}>
                  Confirme a validade deste documento em:
                </Text>
                <Text style={styles.authLink}>
                  cnpjaqui.com.br/validar/{documentId}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
