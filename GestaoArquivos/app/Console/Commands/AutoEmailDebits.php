<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Debits;
use Illuminate\Support\Carbon;
use Mail;
use App\Mail\DebitDayEmail;

class AutoEmailDebits extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:auto-email-debits';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $date = Carbon::parse($now)->toDateString();

        $debits = Debits::whereDate('debtDueDate', '<=', $date)->get();

        if ($debits->count() > 0) {
            foreach ($debits as $debit) {
                Mail::to($debit)->send(new DebitDayEmail($debit));
            }
        }

        return 0;

    }
}
