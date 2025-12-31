import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { CnpjData } from "../services/cnpj.service";
import {
  formatCEP,
  formatCNPJComplete,
  formatDateBR,
  formatPhoneBR,
  isMatriz,
  isSituacaoAtiva,
} from "../utils";
import { BrasaoRepublica } from "./icons";

const styles = StyleSheet.create({
  page: {
    padding: 16,
    fontSize: 8,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  mainBorder: {
    border: "1.5pt solid #1a1a1a",
    padding: 10,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: "0.5pt solid #cccccc",
  },
  brasao: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1a1a1a",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1a1a1a",
    letterSpacing: 0.3,
  },
  spacer: {
    width: 48,
    marginLeft: 12,
  },
  firstRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  cnpjBox: {
    width: "24%",
    border: "1pt solid #333333",
    padding: 6,
    backgroundColor: "#f5f5f5",
  },
  documentTitleBox: {
    width: "52%",
    border: "1pt solid #333333",
    borderLeft: "none",
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  dataAberturaBox: {
    width: "24%",
    border: "1pt solid #333333",
    borderLeft: "none",
    padding: 6,
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 6,
    marginBottom: 3,
    color: "#555555",
    fontWeight: "bold",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
    lineHeight: 1.3,
  },
  valueSmall: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#000000",
    lineHeight: 1.3,
  },
  documentTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1a1a1a",
    letterSpacing: 0.3,
    lineHeight: 1.4,
    textTransform: "uppercase",
  },
  fullWidthBox: {
    border: "1pt solid #333333",
    padding: 6,
    marginBottom: 4,
    width: "100%",
  },
  twoColumnRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  leftColumn: {
    width: "85%",
    border: "1pt solid #333333",
    padding: 6,
  },
  rightColumn: {
    width: "15%",
    border: "1pt solid #333333",
    borderLeft: "none",
    padding: 6,
  },
  threeColumnRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  fourColumnRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  col50: {
    width: "50%",
    border: "1pt solid #333333",
    padding: 6,
  },
  col50Right: {
    width: "50%",
    border: "1pt solid #333333",
    borderLeft: "none",
    padding: 6,
  },
  col14: {
    width: "14%",
    border: "1pt solid #333333",
    borderLeft: "none",
    padding: 6,
  },
  col36: {
    width: "36%",
    border: "1pt solid #333333",
    borderLeft: "none",
    padding: 6,
  },
  col18: {
    width: "18%",
    border: "1pt solid #333333",
    padding: 6,
  },
  col30: {
    width: "30%",
    border: "1pt solid #333333",
    borderLeft: "none",
    padding: 6,
  },
  col38: {
    width: "38%",
    border: "1pt solid #333333",
    borderLeft: "none",
    padding: 6,
  },
  col75: {
    width: "75%",
    border: "1pt solid #333333",
    padding: 6,
  },
  col25: {
    width: "25%",
    border: "1pt solid #333333",
    borderLeft: "none",
    padding: 6,
  },
  activityItem: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#000000",
    lineHeight: 1.3,
  },
  approvalRow: {
    marginBottom: 4,
    width: "100%",
    alignItems: "center",
  },
  approvalText: {
    fontSize: 7,
    color: "#333333",
    lineHeight: 1.2,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomRow: {
    width: "100%",
    alignItems: "center",
  },
  emissionRow: {
    marginBottom: 4,
    alignItems: "center",
  },
  footerContainer: {
    marginTop: 6,
    borderTop: "0.5pt solid #cccccc",
    paddingTop: 6,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emissionColumn: {
    flex: 1,
    justifyContent: "center",
  },
  footerText: {
    fontSize: 6,
    color: "#333333",
    marginBottom: 1,
  },
  qrCodeColumn: {
    flexDirection: "row",
    alignItems: "center",
  },
  qrCode: {
    width: 40,
    height: 40,
    marginRight: 6,
  },
  authBox: {
    justifyContent: "center",
  },
  authText: {
    fontSize: 5.5,
    color: "#444444",
    lineHeight: 1.2,
  },
  authLink: {
    fontSize: 5.5,
    color: "#0056b3",
    fontWeight: "bold",
    marginTop: 1,
  },
  situacaoAtiva: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#006400",
    lineHeight: 1.3,
  },
  situacaoInativa: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8B0000",
    lineHeight: 1.3,
  },
});

interface CartaoCNPJProps {
  data: CnpjData;
  emitidoEm?: Date;
  documentId: string;
  qrCodeDataUrl: string;
  validationBaseUrl?: string;
}

export function CartaoCNPJ({
  data,
  emitidoEm = new Date(),
  documentId,
  qrCodeDataUrl,
  validationBaseUrl = "www.cnpjaqui.com.br",
}: CartaoCNPJProps) {
  const cnpjFormatado = formatCNPJComplete(data.cnpj);
  const tipoEstabelecimento = isMatriz(data.cnpj) ? "MATRIZ" : "FILIAL";
  const situacaoAtiva = isSituacaoAtiva(data.situacaoCadastral);

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

  const telefoneFormatado = formatPhoneBR(data.telefone);

  return (
    <Document
      title={`Cartão CNPJ - ${data.razaoSocial}`}
      author="Receita Federal do Brasil"
      subject="Comprovante de Inscrição e de Situação Cadastral"
      keywords="CNPJ, Receita Federal, Brasil"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.mainBorder}>
          <View style={styles.headerContainer}>
            <BrasaoRepublica style={styles.brasao} />
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
              <Text style={styles.valueSmall}>{tipoEstabelecimento}</Text>
            </View>
            <View style={styles.documentTitleBox}>
              <Text style={styles.documentTitle}>
                COMPROVANTE DE INSCRIÇÃO{"\n"}E DE SITUAÇÃO CADASTRAL
              </Text>
            </View>
            <View style={styles.dataAberturaBox}>
              <Text style={styles.label}>DATA DE ABERTURA</Text>
              <Text style={styles.value}>
                {formatDateBR(data.dataAbertura)}
              </Text>
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
              <Text style={styles.value}>
                {data.nomeFantasia || "********"}
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.label}>PORTE</Text>
              <Text style={styles.valueSmall}>{data.porte || "**"}</Text>
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
                {data.atividadesSecundarias
                  .slice(0, 10)
                  .map((atividade, index) => (
                    <Text
                      key={`atividade-${atividade.codigo}-${index}`}
                      style={styles.activityItem}
                    >
                      {atividade.codigo} - {atividade.descricao}
                    </Text>
                  ))}
                {data.atividadesSecundarias.length > 10 && (
                  <Text style={styles.activityItem}>
                    ... e mais {data.atividadesSecundarias.length - 10}{" "}
                    atividade(s)
                  </Text>
                )}
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
              <Text style={styles.value}>{data.numero || "S/N"}</Text>
            </View>
            <View style={styles.col36}>
              <Text style={styles.label}>COMPLEMENTO</Text>
              <Text style={styles.value}>{data.complemento || "********"}</Text>
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
              <Text style={styles.value}>
                {data.email?.toLowerCase() || "********"}
              </Text>
            </View>
            <View style={styles.col50Right}>
              <Text style={styles.label}>TELEFONE</Text>
              <Text style={styles.value}>
                {telefoneFormatado || "********"}
              </Text>
            </View>
          </View>

          <View style={styles.fullWidthBox}>
            <Text style={styles.label}>ENTE FEDERATIVO RESPONSÁVEL (EFR)</Text>
            <Text style={styles.value}>{data.efr || "********"}</Text>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.col75}>
              <Text style={styles.label}>SITUAÇÃO CADASTRAL</Text>
              <Text
                style={
                  situacaoAtiva ? styles.situacaoAtiva : styles.situacaoInativa
                }
              >
                {data.situacaoCadastral}
              </Text>
            </View>
            <View style={styles.col25}>
              <Text style={styles.label}>DATA DA SITUAÇÃO CADASTRAL</Text>
              <Text style={styles.value}>
                {formatDateBR(data.dataSituacaoCadastral)}
              </Text>
            </View>
          </View>

          <View style={styles.fullWidthBox}>
            <Text style={styles.label}>MOTIVO DE SITUAÇÃO CADASTRAL</Text>
            <Text style={styles.value}>
              {data.motivoSituacaoCadastral || "********"}
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
                  ? formatDateBR(data.dataSituacaoEspecial)
                  : "********"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.footerRow}>
            <View style={styles.emissionColumn}>
              <Text style={styles.footerText}>
                Emitido no dia {dataEmissao} às {horaEmissao} (data e hora de
                Brasília).
              </Text>
              <Text style={styles.footerText}>Página: 1/1</Text>
            </View>

            <View style={styles.qrCodeColumn}>
              <Image src={qrCodeDataUrl} style={styles.qrCode} />
              <View style={styles.authBox}>
                <Text style={styles.authText}>
                  Autenticidade digital verificada.
                </Text>
                <Text style={styles.authText}>
                  Confirme a validade deste documento em:
                </Text>
                <Text style={styles.authLink}>
                  {validationBaseUrl}/validar/{documentId}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default CartaoCNPJ;
