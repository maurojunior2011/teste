import { ReactElement } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useFileContext } from "@/context";

function FileList(): ReactElement {

  const { state: { fileList } } = useFileContext();

  // Remember to keep the fileList updated after upload a new file

    return (
      <>
        <h1 className="text-2xl font-bold pt-5 text-green-800">Lista de Arquivos Recentementes Enviados Nesta Sessão.</h1>

        <Table>
          <TableCaption>Lista de Arquivos Recentementes Enviados Nesta Sessão.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nome</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Última Modificação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {fileList?.map((x,i) =>
            <TableRow key={i}>
            <TableCell className="font-medium">{x.name}</TableCell>
            <TableCell>{formatBytes(x.size)}</TableCell>
            <TableCell>{new Date(parseInt(x.lastModified.toString(), 10)).toString()}</TableCell>
          </TableRow>
          )}
          </TableBody>
        </Table>
      </>
    )
}

function formatBytes(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}`}

export { FileList };
