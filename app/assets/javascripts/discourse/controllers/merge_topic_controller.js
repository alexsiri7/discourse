/**
  Modal related to auto closing of topics

  @class MergeTopicController
  @extends Discourse.ObjectController
  @namespace Discourse
  @uses Discourse.ModalFunctionality
  @module Discourse
**/
Discourse.MergeTopicController = Discourse.ObjectController.extend(Discourse.SelectedPostsCount, Discourse.ModalFunctionality, {
  needs: ['topic'],

  topicController: Em.computed.alias('controllers.topic'),
  selectedPosts: Em.computed.alias('topicController.selectedPosts'),
  allPostsSelected: Em.computed.alias('topicController.allPostsSelected'),

  buttonDisabled: function() {
    if (this.get('saving')) return true;
    return this.blank('selectedTopicId');
  }.property('selectedTopicId', 'saving'),

  buttonTitle: function() {
    if (this.get('saving')) return Em.String.i18n('saving');
    return Em.String.i18n('topic.merge_topic.title');
  }.property('saving'),

  movePostsToExistingTopic: function() {
    this.set('saving', true);

    var promise = null;
    if (this.get('allPostsSelected')) {
      promise = Discourse.Topic.mergeTopic(this.get('id'), this.get('selectedTopicId'));
    } else {
      var postIds = this.get('selectedPosts').map(function(p) { return p.get('id'); });
      promise = Discourse.Topic.movePosts(this.get('id'), {
        destination_topic_id: this.get('selectedTopicId'),
        post_ids: postIds
      });
    }

    var mergeTopicController = this;
    promise.then(function(result) {
      // Posts moved
      mergeTopicController.send('closeModal');
      mergeTopicController.get('topicController').toggleMultiSelect();
      Em.run.next(function() { Discourse.URL.routeTo(result.url); });
    }, function() {
      // Error moving posts
      mergeTopicController.flash(Em.String.i18n('topic.merge_topic.error'));
      mergeTopicController.set('saving', false);
    });
    return false;
  }

});