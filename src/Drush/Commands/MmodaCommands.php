<?php
namespace Drupal\mmoda\Drush\Commands;

use Consolidation\OutputFormatters\StructuredData\RowsOfFields;
use Drupal\Core\Utility\Token;
use Drush\Attributes as CLI;
use Drush\Commands\DrushCommands;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * A Drush commandfile.
 */
final class MmodaCommands extends DrushCommands {

  /**
   * Constructs a MmodaCommands object.
   */
  public function __construct(
    private readonly Token $token,
  ) {
  parent::__construct();
}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('token'),
    );
  }

  /**
   * Command description here.
   */
  #[CLI\Command(name: 'mmoda:export-book-csv', aliases: ['mmodaebcsv'])]
  #[CLI\Argument(name: 'filename', description: 'Argument description.')]
  #[CLI\Usage(name: 'mmoda:export-book-csv content/book.csv', description: 'Export the whole book table in a CSV file')]
  public function exportBookCsv($filename) {
    $query = \Drupal::database()->select('node', 'n');
    $query->addField('n', 'nid');
    $query->addField('n', 'uuid');
    $nid_to_uuid = $query->execute()->fetchAllAssoc('nid');

    $query = \Drupal::database()->select('book', 'b');
    $query->fields('b');
    $book = $query->execute()->fetchAll();

    $change_cols= array('nid', 'pid', 'bid', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9');

    foreach ($book as $i=> $p) {
      foreach ($p as $key => $val) {
        if (in_array($key, $change_cols) and $val != 0) {
          $book[$i]->$key= $nid_to_uuid[$val]->uuid;
        }
      }
    }

    $csv_file = new \SplFileObject($filename, 'w');
    $csv_file->fputcsv(array_keys((array) $book[0]));
    foreach ($book as $row) {
      $csv_file->fputcsv(array_values((array)$row));
    }
    $this->logger()->success(dt('File exported successfully.'));
  }

  /**
   * Command description here.
   */
  #[CLI\Command(name: 'mmoda:import-book-csv', aliases: ['mmodaibcsv'])]
  #[CLI\Argument(name: 'filename', description: 'Book CSV file name')]
  #[CLI\Usage(name: 'mmoda:import-book-csv content/book.csv', description: 'Import the whole book table from a CSV file')]
  public function importBookCsv($filename) {
    /* Map Rows and Loop Through Them */
    $rows   = array_map('str_getcsv', file($filename));
    $book_table_col_names = array_shift($rows);
    $book    = array();
    foreach($rows as $row) {
      $book[] = array_combine($book_table_col_names, $row);
    }

    $connection = \Drupal::database();

    $query = $connection->select('node', 'n');
    $query->addField('n', 'nid');
    $query->addField('n', 'uuid');
    $uuid_to_nid = $query->execute()->fetchAllAssoc('uuid');

    $change_cols= array('nid', 'pid', 'bid', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9');

    foreach ($book as $i=> $p) {
      foreach ($p as $key => $val) {
        if (in_array($key, $change_cols) and $val != 0) {
          $book[$i][$key]= $uuid_to_nid[$val]->nid;
        }
      }
    }

    $transaction = $connection->startTransaction();

    try {
      $num_deleted = $connection->delete('book')
      ->execute();
      $query = $connection->insert('book')->fields($book_table_col_names);
      foreach ($book as $record) {
        $query->values($record);
      }
      $query->execute();
    }
    catch (Exception $e) {
      // There was an error in writing to the database, so the database is rolled back
      // to the state when the transaction was started.
      $transaction->rollBack();
    }

    // Commit the transaction by unsetting the $transaction variable.
    unset($transaction);
       $this->logger()->success(dt('File imported successfully.'));
  }

  /**
   * An example of the table output format.
  #[CLI\Command(name: 'mmoda:token', aliases: ['token'])]
  #[CLI\FieldLabels(labels: [
    'group' => 'Group',
    'token' => 'Token',
    'name' => 'Name'
  ])]
  #[CLI\DefaultTableFields(fields: ['group', 'token', 'name'])]
  #[CLI\FilterDefaultField(field: 'name')]
  public function token($options = ['format' => 'table']): RowsOfFields {
    $all = $this->token->getInfo();
    foreach ($all['tokens'] as $group => $tokens) {
      foreach ($tokens as $key => $token) {
        $rows[] = [
          'group' => $group,
          'token' => $key,
          'name' => $token['name'],
        ];
      }
    }
    return new RowsOfFields($rows);
  }
   */

}
