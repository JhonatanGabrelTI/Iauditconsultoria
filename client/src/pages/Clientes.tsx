import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Users, Building2, User, Shield, FileText, FileCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regimeFilter, setRegimeFilter] = useState<string>("");
  const [personTypeFilter, setPersonTypeFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [consultaDialogOpen, setConsultaDialogOpen] = useState(false);
  const [consultaResult, setConsultaResult] = useState<any>(null);

  const consultarCNDFederal = trpc.apiConsultas.consultarCNDFederal.useMutation({
    onSuccess: (data) => {
      setConsultaResult({ tipo: "CND Federal", ...data });
      setConsultaDialogOpen(true);
      refetch();
    },
    onError: (error) => {
      toast.error("Erro ao consultar CND Federal: " + error.message);
    },
  });

  const consultarCNDEstadual = trpc.apiConsultas.consultarCNDEstadual.useMutation({
    onSuccess: (data) => {
      setConsultaResult({ tipo: "CND Estadual PR", ...data });
      setConsultaDialogOpen(true);
      refetch();
    },
    onError: (error) => {
      toast.error("Erro ao consultar CND Estadual: " + error.message);
    },
  });

  const consultarFGTS = trpc.apiConsultas.consultarRegularidadeFGTS.useMutation({
    onSuccess: (data) => {
      setConsultaResult({ tipo: "Regularidade FGTS", ...data });
      setConsultaDialogOpen(true);
      refetch();
    },
    onError: (error) => {
      toast.error("Erro ao consultar Regularidade FGTS: " + error.message);
    },
  });

  const handleConsultarCNDFederal = (clientId: number) => {
    if (confirm("Deseja consultar a CND Federal deste cliente?")) {
      consultarCNDFederal.mutate({ clientId });
    }
  };

  const handleConsultarCNDEstadual = (clientId: number) => {
    if (confirm("Deseja consultar a CND Estadual deste cliente?")) {
      consultarCNDEstadual.mutate({ clientId });
    }
  };

  const handleConsultarFGTS = (clientId: number) => {
    if (confirm("Deseja consultar a Regularidade FGTS deste cliente?")) {
      consultarFGTS.mutate({ clientId });
    }
  };

  const { data: clients, isLoading, refetch } = trpc.clients.search.useQuery({
    searchTerm: searchTerm || undefined,
    regimeTributario: regimeFilter || undefined,
    personType: personTypeFilter || undefined,
  });

  const createClient = trpc.clients.create.useMutation({
    onSuccess: () => {
      toast.success("Cliente cadastrado com sucesso!");
      setDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar cliente: " + error.message);
    },
  });

  const [formData, setFormData] = useState<{
    personType: "juridica" | "fisica";
    cnpjCpf: string;
    razaoSocialNome: string;
    regimeTributario?: "simples_nacional" | "lucro_presumido" | "lucro_real" | "mei" | "isento";
    inscricaoEstadual?: string;
    emails?: string;
    whatsapps?: string;
  }>({
    personType: "juridica",
    cnpjCpf: "",
    razaoSocialNome: "",
    regimeTributario: undefined,
    inscricaoEstadual: "",
    emails: "",
    whatsapps: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClient.mutate(formData);
  };

  const totalClients = clients?.length || 0;
  const activeClients = clients?.filter(c => c.active).length || 0;

  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie sua base de clientes
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Cliente</DialogTitle>
                <DialogDescription>
                  Adicione um novo cliente à sua base
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs
                  value={formData.personType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, personType: value as "juridica" | "fisica" })
                  }
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="juridica">
                      <Building2 className="h-4 w-4 mr-2" />
                      Pessoa Jurídica
                    </TabsTrigger>
                    <TabsTrigger value="fisica">
                      <User className="h-4 w-4 mr-2" />
                      Pessoa Física
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cnpjCpf">
                      {formData.personType === "juridica" ? "CNPJ" : "CPF"}
                    </Label>
                    <Input
                      id="cnpjCpf"
                      placeholder={formData.personType === "juridica" ? "00.000.000/0000-00" : "000.000.000-00"}
                      value={formData.cnpjCpf}
                      onChange={(e) => setFormData({ ...formData, cnpjCpf: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="razaoSocialNome">
                      {formData.personType === "juridica" ? "Razão Social" : "Nome Completo"}
                    </Label>
                    <Input
                      id="razaoSocialNome"
                      placeholder={formData.personType === "juridica" ? "EMPRESA LTDA" : "Nome Completo"}
                      value={formData.razaoSocialNome}
                      onChange={(e) => setFormData({ ...formData, razaoSocialNome: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="regimeTributario">Regime Tributário</Label>
                    <Select
                      value={formData.regimeTributario}
                      onValueChange={(value) => setFormData({ ...formData, regimeTributario: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um regime" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                        <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                        <SelectItem value="lucro_real">Lucro Real</SelectItem>
                        <SelectItem value="mei">MEI</SelectItem>
                        <SelectItem value="isento">Isento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.personType === "juridica" && (
                    <div>
                      <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                      <Input
                        id="inscricaoEstadual"
                        placeholder="000.000.000.000"
                        value={formData.inscricaoEstadual}
                        onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="emails">E-mails (separados por vírgula)</Label>
                    <Input
                      id="emails"
                      placeholder="email1@example.com, email2@example.com"
                      value={formData.emails}
                      onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapps">WhatsApp (separados por vírgula)</Label>
                    <Input
                      id="whatsapps"
                      placeholder="(11) 99999-9999, (11) 98888-8888"
                      value={formData.whatsapps}
                      onChange={(e) => setFormData({ ...formData, whatsapps: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createClient.isPending}>
                    {createClient.isPending ? "Salvando..." : "Salvar Cliente"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{activeClients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sem Certificado</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sem Procuração</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Pesquisar Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Filtre por nome, CNPJ ou CPF..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Regime Tributário</Label>
                <Select value={regimeFilter} onValueChange={setRegimeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                    <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="lucro_real">Lucro Real</SelectItem>
                    <SelectItem value="mei">MEI</SelectItem>
                    <SelectItem value="isento">Isento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tipo de Pessoa</Label>
                <Select value={personTypeFilter} onValueChange={setPersonTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                    <SelectItem value="fisica">Pessoa Física</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              {totalClients} cliente{totalClients !== 1 ? "s" : ""} encontrado{totalClients !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando...</p>
              </div>
            ) : clients && clients.length > 0 ? (
              <div className="space-y-2">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {client.personType === "juridica" ? (
                          <Building2 className="h-5 w-5 text-primary" />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{client.razaoSocialNome}</p>
                        <p className="text-sm text-muted-foreground">{client.cnpjCpf}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {client.regimeTributario && (
                        <span className="text-xs px-2 py-1 rounded-md bg-muted">
                          {client.regimeTributario.replace(/_/g, " ").toUpperCase()}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        {client.personType === "juridica" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              title="Consultar CND Federal"
                              onClick={() => handleConsultarCNDFederal(client.id)}
                              disabled={consultarCNDFederal.isPending}
                            >
                              <FileCheck className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              title="Consultar Regularidade FGTS"
                              onClick={() => handleConsultarFGTS(client.id)}
                              disabled={consultarFGTS.isPending}
                            >
                              <Building2 className="h-4 w-4 text-green-500" />
                            </Button>
                          </>
                        )}
                        {client.inscricaoEstadual && (
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Consultar CND Estadual"
                            onClick={() => handleConsultarCNDEstadual(client.id)}
                            disabled={consultarCNDEstadual.isPending}
                          >
                            <FileText className="h-4 w-4 text-purple-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum cliente encontrado</p>
                <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar primeiro cliente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Resultado de Consulta */}
        <Dialog open={consultaDialogOpen} onOpenChange={setConsultaDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resultado da Consulta</DialogTitle>
              <DialogDescription>
                {consultaResult?.tipo}
              </DialogDescription>
            </DialogHeader>
            {consultaResult && (
              <div className="space-y-4">
                {consultaResult.sucesso ? (
                  <>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="font-semibold text-green-600">✓ Consulta realizada com sucesso</p>
                    </div>
                    
                    {consultaResult.situacao && (
                      <div>
                        <Label>Situação</Label>
                        <p className="text-lg font-semibold">{consultaResult.situacao}</p>
                      </div>
                    )}
                    
                    {consultaResult.numeroCertidao && (
                      <div>
                        <Label>Número da Certidão</Label>
                        <p className="font-mono">{consultaResult.numeroCertidao}</p>
                      </div>
                    )}
                    
                    {consultaResult.dataEmissao && (
                      <div>
                        <Label>Data de Emissão</Label>
                        <p>{consultaResult.dataEmissao}</p>
                      </div>
                    )}
                    
                    {consultaResult.dataValidade && (
                      <div>
                        <Label>Data de Validade</Label>
                        <p>{consultaResult.dataValidade}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="font-semibold text-red-600">✗ Erro na consulta</p>
                    <p className="text-sm mt-2">{consultaResult.mensagem}</p>
                  </div>
                )}
                
                <Button onClick={() => setConsultaDialogOpen(false)} className="w-full">
                  Fechar
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
