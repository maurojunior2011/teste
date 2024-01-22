<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDebitsRequest;
use App\Http\Requests\UpdateDebitsRequest;
use Illuminate\Support\Facades\DB;
use App\Models\Debits;
use Illuminate\Support\Carbon;
use Mail;
use App\Mail\DebitDayEmail;

class DebitsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $beneficiario = new \Eduardokum\LaravelBoleto\Pessoa(
            [
                'nome'      => 'ACME',
                'endereco'  => 'Rua um, 123',
                'cep'       => '99999-999',
                'uf'        => 'UF',
                'cidade'    => 'CIDADE',
                'documento' => '99.999.999/9999-99',
            ]
        );
        
        $pagador = new \Eduardokum\LaravelBoleto\Pessoa(
            [
                'nome'      => 'Cliente',
                'endereco'  => 'Rua um, 123',
                'bairro'    => 'Bairro',
                'cep'       => '99999-999',
                'uf'        => 'UF',
                'cidade'    => 'CIDADE',
                'documento' => '999.999.999-99',
            ]
        );
        
        $boleto = new \Eduardokum\LaravelBoleto\Boleto\Banco\Bancoob(
            [
                'dataVencimento'         => new \Carbon\Carbon(),
                'valor'                  => 100,
                'multa'                  => false,
                'juros'                  => false,
                'numero'                 => 1,
                'numeroDocumento'        => 1,
                'pagador'                => $pagador,
                'beneficiario'           => $beneficiario,
                'carteira'               => 1,
                'agencia'                => 1111,
                'convenio'               => 123123,
                'conta'                  => 22222,
                'descricaoDemonstrativo' => ['demonstrativo 1', 'demonstrativo 2', 'demonstrativo 3'],
                'instrucoes'             => ['instrucao 1', 'instrucao 2', 'instrucao 3'],
                'aceite'                 => 'S',
                'especieDoc'             => 'DM',
            ]
        );

        return response($boleto->renderPDF(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; boleto.pdf',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDebitsRequest $request)
    {
        //
        $file = $request->file('file');
        $fileContents = file($file->getPathname());

        $dataBD = [];
        $cont = 0;
        
        DB::begintransaction();

        $header = true;
        foreach ($fileContents as $line) {
            $data = str_getcsv($line);
            if($data != null) {
                if(!$header) {
                    if($data[0] != null) {

                        $dataBD[] = ['name' => $data[0],
                                 'governmentId' => $data[1],
                                 'email' => $data[2],
                                 'debtAmount' => $data[3],
                                 'debtDueDate' => $data[4],
                                 'debtId' => $data[5]];
                        $cont++;

                        if($cont >= 5000) {
                            Debits::insert($dataBD);

                            $dataBD = [];
                            $cont = 0;
                        }
                    }
                }
                else 
                    $header = false;    
            }
            
        }

        if($cont > 0) {
            Debits::insert($dataBD);
        }

        DB::commit();
        

        return response()->json([
            "message" => "Dados salvos com sucesso!"
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Debits $debits)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Debits $debits)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDebitsRequest $request, Debits $debits)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Debits $debits)
    {
        //
    }
}
