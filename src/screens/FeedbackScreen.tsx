import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { PassengerFeedback, ServiceDelay } from '../types';
import {
  MessageSquare,
  Star,
  Send,
  AlertTriangle,
  CheckCircle,
  ThumbsUp,
  Clock,
  ShieldCheck,
  Filter,
  User,
  Heart,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const FeedbackScreen: React.FC = () => {
  const {
    currentUser,
    routes,
    vehicles,
    feedbacks,
    submitFeedback,
    delays,
    respondToFeedback
  } = useTransit();

  // Form state
  const [passengerName, setPassengerName] = useState(
    currentUser.role === 'Passenger' ? currentUser.name : ''
  );
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id || '');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState<PassengerFeedback['category']>('Driving Safety');
  const [comment, setComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Filter state
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<string>('All');
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});

  const categories: PassengerFeedback['category'][] = [
    'Punctuality',
    'Cleanliness',
    'Driving Safety',
    'Staff Behavior',
    'Crowding / Comfort',
    'App Experience'
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const route = routes.find(r => r.id === selectedRouteId);

    submitFeedback({
      passengerName: isAnonymous ? 'Anonymous Commuter' : passengerName || 'Verified Commuter',
      isAnonymous,
      routeId: selectedRouteId,
      routeCode: route?.code || '101',
      vehicleId: selectedVehicleId || undefined,
      rating,
      category,
      comment
    });

    setComment('');
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 5000);
  };

  const activeDelays = delays.filter(d => d.status === 'Active');
  const resolvedDelays = delays.filter(d => d.status === 'Resolved');

  const filteredFeedbacks = feedbacks.filter(fb => {
    if (feedbackCategoryFilter === 'All') return true;
    return fb.category === feedbackCategoryFilter;
  });

  const avgRating = (feedbacks.reduce((acc, f) => acc + f.rating, 0) / (feedbacks.length || 1)).toFixed(1);
  const positivePercent = Math.round((feedbacks.filter(f => f.sentiment === 'Positive').length / (feedbacks.length || 1)) * 100);

  const canRespond = currentUser.role === 'Admin' || currentUser.role === 'Transport Operator';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Passenger Experience &amp; Service Alerts Hub
            </h1>
            <Badge variant="green">Community Voice</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Submit ratings for recent transit journeys, monitor active system delay bulletins, and track service reliability.
          </p>
        </div>

        {/* Aggregate Score Badge */}
        <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/80 px-4 py-2.5 rounded-xl self-start md:self-auto">
          <div className="flex text-amber-500">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900">{avgRating} / 5.0 Rating</div>
            <div className="text-[10px] text-slate-500">{positivePercent}% Positive Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Feedback Form & Alerts Bulletin (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Feedback Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-lg bg-transit-50 text-transit-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Rate Your Transit Trip</h3>
                <p className="text-xs text-slate-500">Your feedback improves our fleet and drivers</p>
              </div>
            </div>

            {submittedSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your feedback has been recorded and submitted to transit dispatch.</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Overall Journey Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {rating === 5 ? 'Excellent 🌟' : rating === 4 ? 'Very Good 👍' : rating === 3 ? 'Average 😐' : 'Needs Improvement ⚠️'}
                  </span>
                </div>
              </div>

              {/* Passenger Name & Anon Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Passenger Name</label>
                  <label className="text-[11px] text-slate-500 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="rounded text-transit-600 focus:ring-0"
                    />
                    <span>Post Anonymously</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Your full name"
                  disabled={isAnonymous}
                  value={isAnonymous ? 'Anonymous Commuter' : passengerName}
                  onChange={e => setPassengerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-transit-500/20 disabled:opacity-50"
                />
              </div>

              {/* Route & Vehicle Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Route Taken</label>
                  <select
                    value={selectedRouteId}
                    onChange={e => setSelectedRouteId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-transit-500/20"
                  >
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>
                        Line {r.code} - {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle (Optional)</label>
                  <select
                    value={selectedVehicleId}
                    onChange={e => setSelectedVehicleId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-transit-500/20"
                  >
                    <option value="">Any / Not Sure</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.regNumber}>
                        {v.regNumber} ({v.model.slice(0, 16)}...)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Category</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all border ${
                        category === cat
                          ? 'bg-transit-50 border-transit-400 text-transit-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trip Comments &amp; Suggestions
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details regarding punctuality, vehicle cleanliness, air conditioning, driver courtesy..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-transit-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-transit-600 hover:bg-transit-700 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Journey Review</span>
              </button>
            </form>
          </div>

          {/* Active Service Delays Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Active Service Delay Bulletins
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {activeDelays.length} Alerts
              </span>
            </div>

            {activeDelays.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                No active delays reported. All transit corridors operating on time.
              </div>
            ) : (
              <div className="space-y-3">
                {activeDelays.map(delay => (
                  <div key={delay.id} className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-mono">
                          Route {delay.routeCode}
                        </span>
                        <span>{delay.routeName}</span>
                      </span>
                      <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        +{delay.delayMinutes} min delay
                      </span>
                    </div>

                    <p className="text-slate-700">
                      <strong>Cause:</strong> {delay.cause}
                    </p>

                    <div className="text-[11px] text-slate-500">
                      <strong>Mitigation:</strong> {delay.actionTaken}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-amber-200/50 text-[10px] text-slate-400">
                      <span>Reported by: {delay.reportedByName} ({delay.reportedByRole})</span>
                      <span>At: {delay.reportedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Public Reviews Stream & Service History (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Reviews Stream Header & Filter */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Community Feedback Feed</h3>
                <p className="text-xs text-slate-500">Verified passenger experiences from daily commuters</p>
              </div>

              {/* Category Filter */}
              <select
                value={feedbackCategoryFilter}
                onChange={e => setFeedbackCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium focus:outline-none"
              >
                <option value="All">All Categories ({feedbacks.length})</option>
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* List of Feedback Cards */}
            <div className="divide-y divide-slate-100 mt-2 space-y-3">
              {filteredFeedbacks.map(fb => (
                <div key={fb.id} className="pt-4 first:pt-2 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {fb.passengerName[0] || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{fb.passengerName}</h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-transit-50 text-transit-700 font-mono font-bold">
                            Route {fb.routeCode}
                          </span>
                          {fb.vehicleId && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({fb.vehicleId})
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{fb.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < fb.rating ? 'fill-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <Badge
                        variant={
                          fb.sentiment === 'Positive'
                            ? 'green'
                            : fb.sentiment === 'Negative'
                            ? 'red'
                            : 'amber'
                        }
                        size="sm"
                      >
                        {fb.category}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                    "{fb.comment}"
                  </p>

                  {/* Official Transit Reply if any */}
                  {fb.adminResponse && (
                    <div className="ml-4 pl-3 border-l-2 border-emerald-600 text-xs bg-emerald-50/60 p-2.5 rounded-r-lg">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 mb-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>TGSRTC Warangal Regional Operations Authority Response</span>
                      </div>
                      <p className="text-slate-700 text-[11px]">{fb.adminResponse}</p>
                    </div>
                  )}

                  {/* Admin / Operator inline reply tool */}
                  {canRespond && !fb.adminResponse && (
                    <div className="pt-1 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type official operator response..."
                        value={replyText[fb.id] || ''}
                        onChange={e => setReplyText({ ...replyText, [fb.id]: e.target.value })}
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                      <button
                        onClick={() => {
                          if (replyText[fb.id]) {
                            respondToFeedback(fb.id, replyText[fb.id]);
                            setReplyText({ ...replyText, [fb.id]: '' });
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#0d6e52] text-white text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Historical Service Reliability Log */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Recent Service Disruption History &amp; Resolutions
            </h3>

            <div className="space-y-2.5">
              {resolvedDelays.map(res => (
                <div key={res.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">
                      Route {res.routeCode} ({res.routeName}) &bull; {res.cause}
                    </span>
                    <Badge variant="green" size="sm">Resolved</Badge>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    <strong>Resolution Note:</strong> {res.actionTaken}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Duration: {res.delayMinutes} mins &bull; Reported by {res.reportedByName} &bull; Cleared at {res.estimatedResolutionTime}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
