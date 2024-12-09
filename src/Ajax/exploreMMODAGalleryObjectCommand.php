<?php

namespace Drupal\mmoda\Ajax;

use Drupal\Core\Ajax\CommandInterface;

/**
 * Provides an Ajax command for scrolling to the top of an element.
 *
 * This command is implemented in Drupal.AjaxCommands.prototype.exploreMMODAGalleryObjectCommand.
 */
class exploreMMODAGalleryObjectCommand implements CommandInterface {

  /**
   * A CSS selector string.
   *
   * @var array
   */
  protected $args;

  /**
   * Constructs a exploreMMODAGalleryObjectCommand object.
   *
   * @param array $args
   *   Array of parameters.
   */
  public function __construct($args, $target = 'form') {
    $this->args = $args;
  }

  /**
   * {@inheritdoc}
   */
  public function render() {
    return [
      'command' => 'exploreMMODAGalleryObject',
      'args' => $this->args,
    ];
  }

}
