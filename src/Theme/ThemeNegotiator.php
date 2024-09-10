<?php
namespace Drupal\mmoda\Theme;

use Drupal\Core\Theme\ThemeNegotiatorInterface;
use Drupal\Core\Routing\RouteMatchInterface;

class ThemeNegotiator implements ThemeNegotiatorInterface
{

  /**
   * {@inheritdoc}
   */
  public function applies(RouteMatchInterface $route_match)
  {
    // Use this theme on a certain route.
    // return $route_match->getRouteName() == 'mmoda_route_name';

    // Or use this for more than one route:
    $current_user = \Drupal::currentUser();
    $roles = $current_user->getRoles();
    $possible_routes = array();

    // If the current user is not admin then use the default theme for user profile edit
    if (empty(array_intersect([
      'administrator'
    ], $roles))) {
      $possible_routes[] = 'entity.user.edit_form';
    }

    return (in_array($route_match->getRouteName(), $possible_routes));
  }

  /**
   * {@inheritdoc}
   */
  public function determineActiveTheme(RouteMatchInterface $route_match)
  {
    // Here you return the actual theme name.
    if ($route_match->getRouteName() == 'entity.user.edit_form')
      return \Drupal::config('system.theme')->get('default');
  }
}

